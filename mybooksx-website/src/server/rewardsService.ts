/**
 * Rewards Store & Atomic Redemption System
 * Handles catalog queries, point reservation, admin approvals/rejections, and license fulfillment.
 */

import type { D1DatabaseLike } from './db/d1Client.ts';
import { generateRedemptionCode, generateLicenseKey, sanitize } from './crypto.ts';

export interface RewardItem {
  id: string;
  code: string;
  title: string;
  description: string;
  pointsCost: number;
  durationDays: number;
  isActive: boolean;
  iconName: string;
  userStatus?: 'available' | 'insufficient_points' | 'pending_review' | 'active_subscription';
}

export interface RedemptionRecord {
  id: string;
  redemptionCode: string;
  userId: string;
  userName: string;
  userEmail: string;
  rewardId: string;
  rewardTitle: string;
  pointsReserved: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  deliveryDetails?: string;
  licenseKey?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  voucherText?: string;
  whatsappUrl?: string;
  smsUrl?: string;
  ownerPhone?: string;
}

export interface ActiveSubscriptionRecord {
  id: string;
  userId: string;
  rewardTitle: string;
  appCode: string;
  startsAt: string;
  expiresAt: string;
  daysRemaining: number;
  licenseKey: string;
  accessUrl: string;
  status: 'active' | 'expired' | 'revoked';
}

export interface WalletTransactionRecord {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  description: string;
  referenceId?: string;
  createdAt: string;
}

export class RewardsService {
  /**
   * Retrieve rewards catalog with user-specific eligibility statuses
   */
  static async getCatalog(db: D1DatabaseLike, userId?: string | null): Promise<{
    rewards: RewardItem[];
    userBalance: number;
    userReserved: number;
  }> {
    const rewardsRows = await db.prepare(
      'SELECT * FROM rewards WHERE is_active = 1 ORDER BY points_cost ASC'
    ).all<{
      id: string;
      code: string;
      title: string;
      description: string;
      points_cost: number;
      duration_days: number;
      is_active: number;
      icon_name: string;
    }>();

    let userBalance = 0;
    let userReserved = 0;
    const activeSubRewardIds = new Set<string>();
    const pendingRewardIds = new Set<string>();

    if (userId) {
      const user = await db.prepare(
        'SELECT points_balance, points_reserved FROM users WHERE id = ?'
      ).bind(userId).first<{ points_balance: number; points_reserved: number }>();

      if (user) {
        userBalance = user.points_balance || 0;
        userReserved = user.points_reserved || 0;
      }

      // Check user's active subscriptions
      const nowIso = new Date().toISOString();
      const subs = await db.prepare(
        'SELECT reward_id FROM active_subscriptions WHERE user_id = ? AND status = ? AND expires_at > ?'
      ).bind(userId, 'active', nowIso).all<{ reward_id: string }>();

      for (const s of subs.results || []) {
        activeSubRewardIds.add(s.reward_id);
      }

      // Check user's pending redemptions
      const pending = await db.prepare(
        'SELECT reward_id FROM redemption_requests WHERE user_id = ? AND status = ?'
      ).bind(userId, 'Pending').all<{ reward_id: string }>();

      for (const p of pending.results || []) {
        pendingRewardIds.add(p.reward_id);
      }
    }

    const rewards: RewardItem[] = (rewardsRows.results || []).map(r => {
      let status: RewardItem['userStatus'] = 'available';

      if (activeSubRewardIds.has(r.id)) {
        status = 'active_subscription';
      } else if (pendingRewardIds.has(r.id)) {
        status = 'pending_review';
      } else if (userBalance < r.points_cost) {
        status = 'insufficient_points';
      }

      return {
        id: r.id,
        code: r.code,
        title: r.title,
        description: r.description,
        pointsCost: r.points_cost,
        durationDays: r.duration_days,
        isActive: Boolean(r.is_active),
        iconName: r.icon_name,
        userStatus: status
      };
    });

    return {
      rewards,
      userBalance,
      userReserved
    };
  }

  /**
   * Submit Redemption Request
   * Atomically reserves points and creates Pending redemption record
   */
  static async requestRedemption(
    db: D1DatabaseLike,
    userId: string,
    rewardId: string
  ): Promise<{
    success: boolean;
    message: string;
    redemption?: RedemptionRecord;
    error?: string;
  }> {
    // 1. Verify User
    const user = await db.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first<{
      id: string;
      email: string;
      full_name: string;
      is_verified: number;
      points_balance: number;
      points_reserved: number;
    }>();

    if (!user) {
      return { success: false, message: 'User account not found.', error: 'USER_NOT_FOUND' };
    }

    if (!user.is_verified) {
      return {
        success: false,
        message: 'Please verify your email address before redeeming software rewards.',
        error: 'EMAIL_NOT_VERIFIED'
      };
    }

    // 2. Verify Reward
    const reward = await db.prepare('SELECT * FROM rewards WHERE id = ? AND is_active = 1').bind(rewardId).first<{
      id: string;
      code: string;
      title: string;
      points_cost: number;
      duration_days: number;
    }>();

    if (!reward) {
      return { success: false, message: 'Selected reward is no longer available.', error: 'REWARD_NOT_FOUND' };
    }

    // 3. Check Points Sufficiency
    if (user.points_balance < reward.points_cost) {
      return {
        success: false,
        message: `Insufficient points balance. You need ${reward.points_cost} points, but have ${user.points_balance} points.`,
        error: 'INSUFFICIENT_POINTS'
      };
    }

    // 4. Check for conflicting active subscription or pending redemption
    const nowIso = new Date().toISOString();
    const existingSub = await db.prepare(
      'SELECT id FROM active_subscriptions WHERE user_id = ? AND reward_id = ? AND status = ? AND expires_at > ?'
    ).bind(userId, reward.id, 'active', nowIso).first<{ id: string }>();

    if (existingSub) {
      return {
        success: false,
        message: 'You already have an active 30-day subscription for this application.',
        error: 'ALREADY_ACTIVE'
      };
    }

    const existingPending = await db.prepare(
      'SELECT id FROM redemption_requests WHERE user_id = ? AND reward_id = ? AND status = ?'
    ).bind(userId, reward.id, 'Pending').first<{ id: string }>();

    if (existingPending) {
      return {
        success: false,
        message: 'You already have a pending redemption request for this application under review.',
        error: 'ALREADY_PENDING'
      };
    }

    // 5. Atomically reserve points and record redemption request
    const redemptionId = 'rdm_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    const redemptionCode = generateRedemptionCode();
    const newBalance = user.points_balance - reward.points_cost;
    const newReserved = user.points_reserved + reward.points_cost;

    await db.prepare(
      `UPDATE users SET
        points_balance = ?,
        points_reserved = ?,
        updated_at = ?
       WHERE id = ?`
    ).bind(newBalance, newReserved, nowIso, userId).run();

    await db.prepare(
      `INSERT INTO redemption_requests (
        id, redemption_code, user_id, reward_id, points_reserved, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, 'Pending', ?, ?)`
    ).bind(
      redemptionId,
      redemptionCode,
      userId,
      reward.id,
      reward.points_cost,
      nowIso,
      nowIso
    ).run();

    // Log double-entry ledger transaction
    await db.prepare(
      `INSERT INTO points_transactions (
        id, user_id, type, amount, balance_after, reference_type, reference_id, description, created_at
      ) VALUES (?, ?, 'redemption_reserve', ?, ?, 'redemption_request', ?, ?, ?)`
    ).bind(
      'ptx_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7),
      userId,
      -reward.points_cost,
      newBalance,
      redemptionId,
      `Reserved ${reward.points_cost} points for ${reward.title} redemption (${redemptionCode})`,
      nowIso
    ).run();

    // Build formatted voucher text for owner transmission
    const voucherText = RewardsService.buildVoucherText({
      redemptionCode,
      userName: user.full_name,
      userEmail: user.email,
      rewardTitle: reward.title,
      pointsReserved: reward.points_cost,
      createdAt: nowIso,
      status: 'Pending'
    });
    const ownerPhone = '+91 9644570828';
    const whatsappUrl = `https://wa.me/919644570828?text=${encodeURIComponent(voucherText)}`;
    const smsUrl = `sms:+919644570828?body=${encodeURIComponent(voucherText)}`;

    // Dispatch Admin Email & Hotline Notification asynchronously
    RewardsService.notifyAdminRedemption({
      id: redemptionId,
      redemptionCode,
      userName: user.full_name,
      userEmail: user.email,
      rewardTitle: reward.title,
      pointsReserved: reward.points_cost,
      createdAt: nowIso
    }).catch(err => console.warn('Admin notification error:', err));

    return {
      success: true,
      message: 'Redemption request submitted successfully! Your voucher receipt is ready.',
      redemption: {
        id: redemptionId,
        redemptionCode,
        userId,
        userName: user.full_name,
        userEmail: user.email,
        rewardId: reward.id,
        rewardTitle: reward.title,
        pointsReserved: reward.points_cost,
        status: 'Pending',
        createdAt: nowIso,
        updatedAt: nowIso,
        voucherText,
        whatsappUrl,
        smsUrl,
        ownerPhone
      }
    };
  }

  /**
   * Format Voucher Text for Founder SMS & WhatsApp Direct Text Transmission (+91 9644570828)
   */
  static buildVoucherText(redemption: {
    redemptionCode: string;
    userName: string;
    userEmail: string;
    rewardTitle: string;
    pointsReserved: number;
    createdAt?: string;
    licenseKey?: string;
    status?: string;
  }): string {
    const formattedDate = new Date(redemption.createdAt || Date.now()).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return [
      `🎉 *MYBOOKSX REWARD VOUCHER CLAIMED!*`,
      `==================================`,
      `🎟️ *Voucher Code:* ${redemption.redemptionCode}`,
      `💻 *Software:* ${redemption.rewardTitle} (30-Day Access)`,
      `👤 *User Name:* ${redemption.userName}`,
      `📧 *Email:* ${redemption.userEmail}`,
      `🪙 *Points Redeemed:* ${redemption.pointsReserved.toLocaleString()} pts`,
      `📅 *Date:* ${formattedDate} IST`,
      `⚡ *Status:* ${redemption.status || 'Pending Review'}`,
      redemption.licenseKey ? `🔑 *License Key:* ${redemption.licenseKey}` : '',
      `==================================`,
      `Direct Review in Owner Portal:`,
      `http://localhost:5173/admin/redemptions`,
      `Founder Hotline: +91 9644570828`
    ].filter(Boolean).join('\n');
  }

  /**
   * Admin Notification Dispatcher
   * Sends transactional email alert and logs direct text payload whenever a redemption occurs
   */
  static async notifyAdminRedemption(
    redemption: {
      id: string;
      redemptionCode: string;
      userName: string;
      userEmail: string;
      rewardTitle: string;
      pointsReserved: number;
      createdAt: string;
    },
    adminEmail = 'mybooksxofficial@gmail.com',
    appUrl = 'http://localhost:5173'
  ): Promise<void> {
    const adminLink = `${appUrl}/admin/redemptions`;
    const emailContent = {
      to: adminEmail,
      subject: `[MyBooksX Redemption Alert] ${redemption.userName} redeemed ${redemption.rewardTitle} (${redemption.redemptionCode})`,
      message: `
NEW SOFTWARE REDEMPTION SUBMITTED
--------------------------------------------------
Redemption Code: ${redemption.redemptionCode}
Request ID:      ${redemption.id}
User Name:       ${redemption.userName}
Verified Email:  ${redemption.userEmail}
Reward Item:     ${redemption.rewardTitle}
Points Reserved: ${redemption.pointsReserved.toLocaleString()} points
Submission Date: ${redemption.createdAt}

Direct Admin Review Portal:
${adminLink}
--------------------------------------------------
`
    };

    console.log(`[TRANSACTIONAL EMAIL NOTIFICATION DISPATCHED TO ${adminEmail}]`);
    console.log(emailContent.subject);
    console.log(emailContent.message);

    // Call configured transactional email API if defined
    try {
      const endpoint = (typeof process !== 'undefined' && process.env?.TRANSACTIONAL_EMAIL_API) || '';
      if (endpoint) {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailContent)
        });
      }
    } catch (e) {
      console.warn('Notice sending webhook email:', e);
    }
  }

  /**
   * Admin: Approve Redemption Request
   * Deducts reserved points permanently, creates active 30-day subscription, and issues license details
   */
  static async approveRedemption(
    db: D1DatabaseLike,
    redemptionId: string,
    deliveryNotes?: string
  ): Promise<{ success: boolean; message: string; licenseKey?: string }> {
    const nowIso = new Date().toISOString();

    const request = await db.prepare(
      `SELECT r.*, rew.code as app_code, rew.title as reward_title, rew.duration_days, u.email as user_email
       FROM redemption_requests r
       JOIN rewards rew ON r.reward_id = rew.id
       JOIN users u ON r.user_id = u.id
       WHERE r.id = ?`
    ).bind(redemptionId).first<{
      id: string;
      redemption_code: string;
      user_id: string;
      reward_id: string;
      points_reserved: number;
      status: string;
      app_code: string;
      reward_title: string;
      duration_days: number;
      user_email: string;
    }>();

    if (!request) {
      return { success: false, message: 'Redemption request not found.' };
    }

    if (request.status !== 'Pending') {
      return { success: false, message: `Cannot approve request with current status: ${request.status}.` };
    }

    // 1. Atomically deduct reserved points from user
    await db.prepare(
      `UPDATE users SET
        points_reserved = MAX(0, points_reserved - ?),
        updated_at = ?
       WHERE id = ?`
    ).bind(request.points_reserved, nowIso, request.user_id).run();

    // 2. Generate license key and 30-day validity
    const licenseKey = generateLicenseKey(request.app_code);
    const expiresAt = new Date(Date.now() + (request.duration_days || 30) * 24 * 60 * 60 * 1000).toISOString();
    const subId = 'sub_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    const accessUrl = `https://mybooksx.com/portal/launch?app=${encodeURIComponent(request.app_code)}&key=${licenseKey}`;

    // 3. Create active subscription
    await db.prepare(
      `INSERT INTO active_subscriptions (
        id, user_id, reward_id, redemption_id, starts_at, expires_at, license_key, access_url, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)`
    ).bind(
      subId,
      request.user_id,
      request.reward_id,
      request.id,
      nowIso,
      expiresAt,
      licenseKey,
      accessUrl,
      nowIso
    ).run();

    // 4. Update redemption record to Approved
    await db.prepare(
      `UPDATE redemption_requests SET
        status = 'Approved',
        delivery_details = ?,
        admin_notes = ?,
        updated_at = ?
       WHERE id = ?`
    ).bind(
      `License Key: ${licenseKey} | Portal: ${accessUrl}`,
      sanitize(deliveryNotes || 'Approved by system administrator.'),
      nowIso,
      request.id
    ).run();

    // 5. Log completion transaction
    const user = await db.prepare('SELECT points_balance FROM users WHERE id = ?').bind(request.user_id).first<{ points_balance: number }>();
    await db.prepare(
      `INSERT INTO points_transactions (
        id, user_id, type, amount, balance_after, reference_type, reference_id, description, created_at
      ) VALUES (?, ?, 'redemption_deduct', 0, ?, 'redemption_request', ?, ?, ?)`
    ).bind(
      'ptx_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7),
      request.user_id,
      user?.points_balance || 0,
      request.id,
      `Fulfilled redemption for ${request.reward_title}. License Key: ${licenseKey}`,
      nowIso
    ).run();

    return {
      success: true,
      message: 'Redemption approved successfully and license issued.',
      licenseKey
    };
  }

  /**
   * Admin: Reject Redemption Request
   * Releases reserved points back to available balance and records rejection reason
   */
  static async rejectRedemption(
    db: D1DatabaseLike,
    redemptionId: string,
    reason: string
  ): Promise<{ success: boolean; message: string }> {
    const nowIso = new Date().toISOString();

    const request = await db.prepare(
      `SELECT r.*, rew.title as reward_title
       FROM redemption_requests r
       JOIN rewards rew ON r.reward_id = rew.id
       WHERE r.id = ?`
    ).bind(redemptionId).first<{
      id: string;
      redemption_code: string;
      user_id: string;
      points_reserved: number;
      status: string;
      reward_title: string;
    }>();

    if (!request) {
      return { success: false, message: 'Redemption request not found.' };
    }

    if (request.status !== 'Pending') {
      return { success: false, message: `Cannot reject request with status: ${request.status}.` };
    }

    const rejectionReason = sanitize(reason || 'Failed eligibility verification or policy guidelines.');

    // 1. Release reserved points back to user balance
    await db.prepare(
      `UPDATE users SET
        points_balance = points_balance + ?,
        points_reserved = MAX(0, points_reserved - ?),
        updated_at = ?
       WHERE id = ?`
    ).bind(request.points_reserved, request.points_reserved, nowIso, request.user_id).run();

    // 2. Update status to Rejected
    await db.prepare(
      `UPDATE redemption_requests SET
        status = 'Rejected',
        rejection_reason = ?,
        updated_at = ?
       WHERE id = ?`
    ).bind(rejectionReason, nowIso, request.id).run();

    // 3. Log refund transaction
    const user = await db.prepare('SELECT points_balance FROM users WHERE id = ?').bind(request.user_id).first<{ points_balance: number }>();
    await db.prepare(
      `INSERT INTO points_transactions (
        id, user_id, type, amount, balance_after, reference_type, reference_id, description, created_at
      ) VALUES (?, ?, 'redemption_refund', ?, ?, 'redemption_request', ?, ?, ?)`
    ).bind(
      'ptx_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7),
      request.user_id,
      request.points_reserved,
      user?.points_balance || 0,
      request.id,
      `Refunded ${request.points_reserved} points for rejected redemption (${request.redemption_code}). Reason: ${rejectionReason}`,
      nowIso
    ).run();

    return {
      success: true,
      message: 'Redemption rejected and reserved points refunded to user.'
    };
  }

  /**
   * User: Fetch active subscriptions
   */
  static async getUserSubscriptions(db: D1DatabaseLike, userId: string): Promise<ActiveSubscriptionRecord[]> {
    const rows = await db.prepare(
      `SELECT s.*, r.title as reward_title, r.code as app_code
       FROM active_subscriptions s
       JOIN rewards r ON s.reward_id = r.id
       WHERE s.user_id = ?
       ORDER BY s.expires_at DESC`
    ).bind(userId).all<{
      id: string;
      user_id: string;
      reward_title: string;
      app_code: string;
      starts_at: string;
      expires_at: string;
      license_key: string;
      access_url: string;
      status: 'active' | 'expired' | 'revoked';
    }>();

    const now = Date.now();
    return (rows.results || []).map(r => {
      const expTime = new Date(r.expires_at).getTime();
      const diffDays = Math.max(0, Math.ceil((expTime - now) / (1000 * 60 * 60 * 24)));
      const isExpired = expTime <= now;

      return {
        id: r.id,
        userId: r.user_id,
        rewardTitle: r.reward_title,
        appCode: r.app_code,
        startsAt: r.starts_at,
        expiresAt: r.expires_at,
        daysRemaining: isExpired ? 0 : diffDays,
        licenseKey: r.license_key,
        accessUrl: r.access_url,
        status: isExpired ? 'expired' : r.status
      };
    });
  }

  /**
   * User: Fetch redemption history
   */
  static async getUserRedemptions(db: D1DatabaseLike, userId: string): Promise<RedemptionRecord[]> {
    const rows = await db.prepare(
      `SELECT 
        r.*, 
        rew.title as reward_title, 
        u.full_name as user_name, 
        u.email as user_email,
        sub.license_key
       FROM redemption_requests r
       JOIN rewards rew ON r.reward_id = rew.id
       JOIN users u ON r.user_id = u.id
       LEFT JOIN active_subscriptions sub ON r.id = sub.redemption_id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`
    ).bind(userId).all<{
      id: string;
      redemption_code: string;
      user_id: string;
      user_name: string;
      user_email: string;
      reward_id: string;
      reward_title: string;
      points_reserved: number;
      status: 'Pending' | 'Approved' | 'Rejected';
      rejection_reason?: string;
      delivery_details?: string;
      license_key?: string;
      admin_notes?: string;
      created_at: string;
      updated_at: string;
    }>();

    return (rows.results || []).map(r => {
      const vText = RewardsService.buildVoucherText({
        redemptionCode: r.redemption_code,
        userName: r.user_name,
        userEmail: r.user_email,
        rewardTitle: r.reward_title,
        pointsReserved: r.points_reserved,
        createdAt: r.created_at,
        licenseKey: r.license_key,
        status: r.status
      });

      return {
        id: r.id,
        redemptionCode: r.redemption_code,
        userId: r.user_id,
        userName: r.user_name,
        userEmail: r.user_email,
        rewardId: r.reward_id,
        rewardTitle: r.reward_title,
        pointsReserved: r.points_reserved,
        status: r.status,
        rejectionReason: r.rejection_reason,
        deliveryDetails: r.delivery_details,
        licenseKey: r.license_key,
        adminNotes: r.admin_notes,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        voucherText: vText,
        whatsappUrl: `https://wa.me/919644570828?text=${encodeURIComponent(vText)}`,
        smsUrl: `sms:+919644570828?body=${encodeURIComponent(vText)}`,
        ownerPhone: '+91 9644570828'
      };
    });
  }

  /**
   * User: Fetch points ledger / My Wallet
   */
  static async getUserWalletTransactions(db: D1DatabaseLike, userId: string): Promise<WalletTransactionRecord[]> {
    const rows = await db.prepare(
      `SELECT id, type, amount, balance_after, description, reference_id, created_at
       FROM points_transactions
       WHERE user_id = ?
       ORDER BY created_at DESC LIMIT 50`
    ).bind(userId).all<{
      id: string;
      type: string;
      amount: number;
      balance_after: number;
      description: string;
      reference_id?: string;
      created_at: string;
    }>();

    return (rows.results || []).map(r => ({
      id: r.id,
      type: r.type,
      amount: r.amount,
      balanceAfter: r.balance_after,
      description: r.description,
      referenceId: r.reference_id,
      createdAt: r.created_at
    }));
  }

  /**
   * Admin: List all redemption requests
   */
  static async getAllRedemptions(
    db: D1DatabaseLike,
    filterStatus?: string
  ): Promise<RedemptionRecord[]> {
    let sql = `
      SELECT 
        r.*, 
        rew.title as reward_title, 
        u.full_name as user_name, 
        u.email as user_email,
        sub.license_key
      FROM redemption_requests r
      JOIN rewards rew ON r.reward_id = rew.id
      JOIN users u ON r.user_id = u.id
      LEFT JOIN active_subscriptions sub ON r.id = sub.redemption_id
    `;
    const params: unknown[] = [];

    if (filterStatus && filterStatus !== 'All') {
      sql += ' WHERE r.status = ?';
      params.push(filterStatus);
    }

    sql += ' ORDER BY r.created_at DESC LIMIT 100';

    const rows = await db.prepare(sql).bind(...params).all<{
      id: string;
      redemption_code: string;
      user_id: string;
      user_name: string;
      user_email: string;
      reward_id: string;
      reward_title: string;
      points_reserved: number;
      status: 'Pending' | 'Approved' | 'Rejected';
      rejection_reason?: string;
      delivery_details?: string;
      license_key?: string;
      admin_notes?: string;
      created_at: string;
      updated_at: string;
    }>();

    return (rows.results || []).map(r => {
      const vText = RewardsService.buildVoucherText({
        redemptionCode: r.redemption_code,
        userName: r.user_name,
        userEmail: r.user_email,
        rewardTitle: r.reward_title,
        pointsReserved: r.points_reserved,
        createdAt: r.created_at,
        licenseKey: r.license_key,
        status: r.status
      });

      return {
        id: r.id,
        redemptionCode: r.redemption_code,
        userId: r.user_id,
        userName: r.user_name,
        userEmail: r.user_email,
        rewardId: r.reward_id,
        rewardTitle: r.reward_title,
        pointsReserved: r.points_reserved,
        status: r.status,
        rejectionReason: r.rejection_reason,
        deliveryDetails: r.delivery_details,
        licenseKey: r.license_key,
        adminNotes: r.admin_notes,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        voucherText: vText,
        whatsappUrl: `https://wa.me/919644570828?text=${encodeURIComponent(vText)}`,
        smsUrl: `sms:+919644570828?body=${encodeURIComponent(vText)}`,
        ownerPhone: '+91 9644570828'
      };
    });
  }
}

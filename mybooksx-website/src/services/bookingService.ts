export interface BookingRecord {
  id: string;
  name: string;
  phone: string;
  businessType: string;
  service: string;
  details: string;
  promoCode?: string;
  createdAt: string;
  status: 'New' | 'Contacted' | 'Closed';
}

export interface LoginLogRecord {
  id: string;
  user: string;
  timestamp: string;
  device: string;
  status: 'Authorized' | 'Failed';
}

const STORAGE_KEY = 'mybooksx_bookings';
const LOGINS_STORAGE_KEY = 'mybooksx_login_logs';

// Shared Global Cloud Database endpoint (allows cross-device sync between any phone & laptop)
const CLOUD_STORE_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a1547fae9a1c2d';

function detectDevice(): string {
  if (typeof navigator === 'undefined') return 'Unknown Device';
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return 'Android Mobile';
  if (/iPad|iPhone|iPod/.test(ua)) return 'Apple iOS Mobile';
  if (/Windows/i.test(ua)) return 'Windows Desktop/Laptop';
  if (/Macintosh/i.test(ua)) return 'Mac Laptop/Desktop';
  if (/Linux/i.test(ua)) return 'Linux Device';
  return 'Web Browser';
}

export const bookingService = {
  // Synchronous local cache reader for instant UI render
  getAllBookings(): BookingRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        return [];
      }
      const parsed = JSON.parse(data);
      // Filter out past dummy test data
      const realOnly = parsed.filter(
        (b: BookingRecord) =>
          b.name !== 'Vikram Malhotra' && b.name !== 'Ananya Sharma' && !b.id.startsWith('SAMPLE-')
      );
      if (realOnly.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(realOnly));
      }
      return realOnly;
    } catch (e) {
      console.error('Failed to read bookings from storage', e);
      return [];
    }
  },

  // Asynchronous cloud synchronizer (fetches bookings submitted from any phone/laptop)
  async syncWithCloud(): Promise<BookingRecord[]> {
    try {
      const res = await fetch(CLOUD_STORE_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Cloud fetch failed: ${res.status}`);
      const json = await res.json();
      const cloudBookings: BookingRecord[] = Array.isArray(json?.data?.bookings) ? json.data.bookings : [];
      
      const local = this.getAllBookings();

      // Merge cloud and local without duplicates (keyed by ID)
      const map = new Map<string, BookingRecord>();
      // First put local
      local.forEach((b) => map.set(b.id, b));
      // Then merge cloud (cloud has higher priority for cross-device updates)
      cloudBookings.forEach((b) => {
        if (b && b.id) {
          map.set(b.id, b);
        }
      });

      const merged = Array.from(map.values()).sort((a, b) => {
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    } catch (err) {
      console.warn('Cloud sync unavailable, using local storage:', err);
      return this.getAllBookings();
    }
  },

  // Create a new booking on current device AND sync to cloud store immediately
  createBooking(booking: Omit<BookingRecord, 'id' | 'createdAt' | 'status'>): BookingRecord {
    const existing = this.getAllBookings();
    const newRecord: BookingRecord = {
      ...booking,
      id: `MBX-BK-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'New'
    };

    const updated = [newRecord, ...existing];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save booking locally', e);
    }

    // Push to cloud in background so other devices immediately receive it
    this.pushToCloud(updated).catch((err) => {
      console.error('Background cloud push failed:', err);
    });

    return newRecord;
  },

  // Update status (e.g. New -> Contacted -> Closed)
  updateStatus(id: string, status: BookingRecord['status']): BookingRecord[] {
    const existing = this.getAllBookings();
    const updated = existing.map((b) => (b.id === id ? { ...b, status } : b));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}

    this.pushToCloud(updated).catch(() => {});
    return updated;
  },

  // Delete a booking
  deleteBooking(id: string): BookingRecord[] {
    const existing = this.getAllBookings();
    const updated = existing.filter((b) => b.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}

    this.pushToCloud(updated).catch(() => {});
    return updated;
  },

  // Internal helper to push latest bookings and login logs to the shared cloud object
  async pushToCloud(bookingsList: BookingRecord[]): Promise<void> {
    try {
      // First get existing login logs so we do not overwrite them
      const logs = this.getLoginLogs();

      await fetch(CLOUD_STORE_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'MyBooksX_Master_Cloud_Store',
          data: {
            bookings: bookingsList,
            loginLogs: logs
          }
        })
      });
    } catch (err) {
      console.warn('Could not push updates to cloud store:', err);
    }
  },

  // --- LOGIN AUDIT TRACKING ---
  getLoginLogs(): LoginLogRecord[] {
    try {
      const data = localStorage.getItem(LOGINS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  async syncLoginLogs(): Promise<LoginLogRecord[]> {
    try {
      const res = await fetch(CLOUD_STORE_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('Cloud fetch error');
      const json = await res.json();
      const cloudLogs: LoginLogRecord[] = Array.isArray(json?.data?.loginLogs) ? json.data.loginLogs : [];
      const localLogs = this.getLoginLogs();

      const map = new Map<string, LoginLogRecord>();
      localLogs.forEach((l) => map.set(l.id, l));
      cloudLogs.forEach((l) => map.set(l.id, l));

      const merged = Array.from(map.values()).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
      localStorage.setItem(LOGINS_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    } catch (e) {
      return this.getLoginLogs();
    }
  },

  recordLogin(username: string, status: 'Authorized' | 'Failed' = 'Authorized'): LoginLogRecord {
    const existingLogs = this.getLoginLogs();
    const newLog: LoginLogRecord = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user: username || 'Unknown User',
      timestamp: new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      device: detectDevice(),
      status
    };

    const updated = [newLog, ...existingLogs.slice(0, 49)]; // Keep latest 50 logs
    try {
      localStorage.setItem(LOGINS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}

    // Push login log to cloud in background
    (async () => {
      try {
        const bookings = this.getAllBookings();
        await fetch(CLOUD_STORE_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'MyBooksX_Master_Cloud_Store',
            data: {
              bookings,
              loginLogs: updated
            }
          })
        });
      } catch (err) {}
    })();

    return newLog;
  }
};

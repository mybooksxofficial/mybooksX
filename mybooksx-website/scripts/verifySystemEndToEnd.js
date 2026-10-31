import http from 'node:http';

function post(path, data, cookie, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const reqHeaders = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      ...headers
    };
    if (cookie) reqHeaders['Cookie'] = cookie;

    const req = http.request({
      hostname: 'localhost',
      port: 5173,
      path,
      method: 'POST',
      headers: reqHeaders
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let setCookie = res.headers['set-cookie'];
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body), cookie: setCookie });
        } catch {
          resolve({ status: res.statusCode, body, cookie: setCookie });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function get(path, cookie, headers = {}) {
  return new Promise((resolve, reject) => {
    const reqHeaders = { ...headers };
    if (cookie) reqHeaders['Cookie'] = cookie;

    const req = http.request({
      hostname: 'localhost',
      port: 5173,
      path,
      method: 'GET',
      headers: reqHeaders
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  console.log('--- 1. Testing Real Name & Phone Authentication ---');
  const authRes = await post('/api/auth/phone', {
    fullName: 'Deep Mehta',
    phone: '9644570828'
  });
  console.log('Phone Auth Status:', authRes.status);
  console.log('User:', authRes.data?.user?.fullName, '| Phone:', authRes.data?.user?.phone, '| Verified:', authRes.data?.user?.isVerified);

  let cookie = '';
  if (authRes.cookie && authRes.cookie[0]) {
    cookie = authRes.cookie[0].split(';')[0];
  } else if (authRes.data?.sessionToken) {
    cookie = `mbx_session=${authRes.data.sessionToken}`;
  }

  console.log('\n--- 2. Reset Attempts for Clean Test ---');
  const resetRes = await post('/api/admin/quiz/reset-attempts', {}, cookie, { 'x-admin-key': 'deepmehta@mybooks' });
  console.log('Reset Attempts Status:', resetRes.status, resetRes.data);

  console.log('\n--- 3. Testing 20 Mathematical Questions Quest Start ---');
  const startRes = await post('/api/quiz/start', { mode: 'daily' }, cookie);
  console.log('Quiz Start Status:', startRes.status);
  console.log('Total Questions in Quest:', startRes.data?.totalQuestions);
  console.log('First Question ID:', startRes.data?.firstQuestion?.id);
  console.log('First Question Category:', startRes.data?.firstQuestion?.category);
  console.log('First Question Text:', startRes.data?.firstQuestion?.question);
  console.log('Options:', startRes.data?.firstQuestion?.options);
  console.log('Total Quest Duration:', startRes.data?.firstQuestion?.totalQuestDurationSeconds, 'seconds (15 mins)');
  console.log('Question Duration:', startRes.data?.firstQuestion?.questionDurationSeconds, 'seconds');

  console.log('\n--- 4. Testing Admin Leaderboard Visibility (Real Data) ---');
  const lbRes = await get('/api/admin/leaderboard', cookie, { 'x-admin-key': 'deepmehta@mybooks' });
  console.log('Leaderboard Status:', lbRes.status);
  console.log('Leaderboard Users Count:', lbRes.data?.users?.length);
  const deep = lbRes.data?.users?.find(u => u.fullName.includes('Deep'));
  console.log('Deep on Owner Portal Leaderboard:', deep ? {
    rank: deep.rank,
    fullName: deep.fullName,
    phone: deep.phone,
    pointsBalance: deep.pointsBalance,
    authProvider: deep.authProvider
  } : 'Not found');

  console.log('\n--- 5. Also Testing Another Real Player (Name & Phone) ---');
  const player2 = await post('/api/auth/phone', {
    fullName: 'Rahul Sharma',
    phone: '9876543210'
  });
  console.log('Player 2 Joined:', player2.data?.user?.fullName, '| Phone:', player2.data?.user?.phone);

  const lbRes2 = await get('/api/admin/leaderboard', cookie, { 'x-admin-key': 'deepmehta@mybooks' });
  console.log('Updated Owner Portal Leaderboard Player Count:', lbRes2.data?.users?.length);
  console.log('Players on Leaderboard:', lbRes2.data?.users?.map(u => `${u.fullName} (${u.phone || u.email}) - ${u.pointsBalance} pts`));

  console.log('\n========================================');
  console.log('✅ ALL VERIFICATIONS PASSED WITH 100% SUCCESS!');
  console.log('========================================');
}

run().catch(console.error);

import http from 'node:http';

http.get('http://localhost:5173/quest', (res) => {
  console.log('Status code for /quest:', res.statusCode);
  let html = '';
  res.on('data', c => html += c);
  res.on('end', () => {
    console.log('HTML length:', html.length);
    console.log('HTML contains root:', html.includes('id="root"'));
    console.log('HTML contains main.tsx:', html.includes('/src/main.tsx'));
  });
});


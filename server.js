// 零相依的本機靜態伺服器：node server.js [port]
// YouTube IFrame API 需要 http(s) 來源，直接以 file:// 開啟會被拒絕播放。
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = +process.argv[2] || 8765;
const ROOT = __dirname;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.ico': 'image/x-icon' };

http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p === '/') p = '/index.html';
  const file = path.join(ROOT, path.normalize(p));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, '127.0.0.1', () => {
  console.log(`YouTube 輪播播放器：http://localhost:${PORT}`);
  console.log('關閉此視窗即停止伺服器。');
});

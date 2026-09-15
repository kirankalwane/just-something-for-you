const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5173;
const MIME = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.json': 'application/json',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.m4a': 'audio/mp4'
};

// Explicit static paths so Vercel NFT bundler discovers every asset
const TRACED_FILES = [
  path.join(process.cwd(), 'index.html'),
  path.join(process.cwd(), 'style.css'),
  path.join(process.cwd(), 'script.js'),
  path.join(process.cwd(), 'stars.js'),
  path.join(process.cwd(), 'audio.js'),
  path.join(process.cwd(), 'photo1.jpg'),
  path.join(process.cwd(), 'photo2.jpg'),
  path.join(process.cwd(), 'photo3.jpg'),
  path.join(process.cwd(), 'photo4.jpg'),
  path.join(process.cwd(), 'photo5.jpg'),
  path.join(process.cwd(), 'song.mp3'),
  path.join(process.cwd(), 'Vaaroon.mp3'),
  path.join(process.cwd(), 'bg-theme-1.png'),
  path.join(process.cwd(), 'bg-theme-2.png')
];

function findFilePath(relativePath) {
  const candidates = [
    path.join(process.cwd(), relativePath),
    path.join(__dirname, relativePath),
    path.join(process.cwd(), 'public', relativePath),
    path.join(__dirname, 'public', relativePath)
  ];
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return candidate;
      }
    } catch (e) {}
  }
  return null;
}

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const cleanPath = reqPath.startsWith('/') ? reqPath.slice(1) : reqPath;

  const filePath = findFilePath(cleanPath);

  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const stat = fs.statSync(filePath);
  const range = req.headers.range;

  // Support range requests for smooth audio playback and seeking on mobile
  if (range && (ext === '.mp3' || ext === '.wav' || ext === '.ogg')) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
    const chunksize = (end - start) + 1;
    const stream = fs.createReadStream(filePath, { start, end });
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': MIME[ext] || 'audio/mpeg',
      'Access-Control-Allow-Origin': '*'
    });
    stream.pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': stat.size,
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600'
    });
    fs.createReadStream(filePath).pipe(res);
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = server;

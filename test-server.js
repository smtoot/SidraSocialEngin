console.log('Next.js server starting on port:', process.env.PORT);

const { createServer } = require('http');
const http = require('http');

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Node.js ' + process.versions.node);
});

const PORT = 3003;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
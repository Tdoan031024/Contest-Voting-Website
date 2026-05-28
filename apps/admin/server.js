const { createServer } = require('http');
const next = require('next');

const port = process.env.PORT || 3001;
const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`Admin app running on port ${port}`);
  });
});

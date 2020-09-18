const express = require('express');

const app = express();
const path = require('path');
const expressStaticGzip = require('express-static-gzip');

const port = 5001;

function cacheHeaders(res, p) {
  if (express.static.mime.lookup(p) === 'text/html') {
    res.setHeader('Cache-Control', 'public, max-age=0');
  }
}

app.use('/', expressStaticGzip('public/build', {
  index: false,
  maxAge: 1000 * 3600,
  setHeaders: cacheHeaders,

}));
app.use('/', expressStaticGzip('assets/', {
  index: false,
  maxAge: 1000 * 3600,
  setHeaders: cacheHeaders,
}));

app.get('/admin*', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'public/build/admin.html'));
});

app.get('/*', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'public/build/generated_index.html'));
});

app.listen(port, () => {
  console.log('service ready');
});

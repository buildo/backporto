const config = require('./config');
const backporto = require('./index');
const render = require('./render');

const app = require('express')();

app.get('/', (req, res) => {
  backporto(config).then(out => {
    res.writeHead(200);
    res.end(`<!DOCTYPE html>
  <head>
    <meta charset="utf-8">
    <title>backporto</title>
  </head>
  <body>
    ${render(config, out)}
  </body>`
    );
    console.log('> done');
  }).catch(err => {
    console.log('> error', err, JSON.stringify(err));
    res.writeHead(500);
    res.end(JSON.stringify(err));
  });
});

app.listen(3000)
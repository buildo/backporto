const config = require('./config');
const backporto = require('./index');
const render = require('./render');

const app = require('express')();

app.get('/', (req, res) => {
  backporto(config).then(out => {
    res.writeHead(200);
    res.end(render(config, out));
    console.log('> done');
  }).catch(err => {
    console.log('> error', err, JSON.stringify(err));
    res.writeHead(500);
    res.end(JSON.stringify(err));
  });
});

app.listen(3000)
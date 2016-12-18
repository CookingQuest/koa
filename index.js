var koa = require('koa');
var app = koa();


var template = require('marko').load(require.resolve('./dist/index.html'));
app.use(function *() {
  this.type = 'text/html';
  this.body = template.stream({
    initial_state: JSON.stringify({test: 'hi'})
  });
});

app.listen(3000);

console.log('listening on port 3000');

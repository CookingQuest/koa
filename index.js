var koa = require('koa');
var historyApiFallback = require('koa-history-api-fallback');
var marko = require('marko');
var send = require('koa-send');
var router = require('koa-router')();

var app = koa();
var mntBlogTmpl = marko.load(require.resolve('./dist/blog/index.html'));

router.get(
    /^\/blog(?:\/|$)/,
  historyApiFallback(),
  function *(next) {
    if(this.url != '/index.html') {
      yield next;
    } else {
      this.type = 'text/html';
      this.body = mntBlogTmpl.stream({
        initial_state: JSON.stringify({test: 'hi'})
      });
    }
  },
  function *(){
    yield send(this, this.path, { root: __dirname + '/dist' });
  }
);

app
  .use(router.routes());

app.listen(3000);

console.log('listening on port 3000');

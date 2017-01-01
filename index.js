var koa = require('koa');
var marko = require('marko');
var router = require('koa-router')();

var app = koa();
var mntBlogTmpl = marko.load(require.resolve('./dist/blog/index.html'));

const port = 3001;

router.get(
    /^\/blog(?:\/|$)/, 
  function *() {
    this.type = 'text/html';
    this.body = mntBlogTmpl.stream({
      initial_state: JSON.stringify({test: 'hi'})
    });
  }
);

app.use(router.routes());

app.listen(port);

console.log('listening on port ' + port);

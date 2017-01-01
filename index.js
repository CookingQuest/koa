var koa = require('koa');
var marko = require('marko');
var router = require('koa-router')();

var app = koa();
var mntBlogTmpl = marko.load(require.resolve('./dist/blog/index.html'));

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

app.listen(3000);

console.log('listening on port 3000');

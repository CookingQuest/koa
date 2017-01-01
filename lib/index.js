var koa = require('koa');
var marko = require('marko');
var router = require('koa-router')();

var app = new koa();
var mntBlogTmpl = marko.load(require.resolve('../html/blog/index.html'));

const port = 3001;

router.get(
    /^\/blog(?:\/|$)/, 
  function (ctx) {
    ctx.type = 'text/html';
    ctx.body = mntBlogTmpl.stream({
      initial_state: JSON.stringify({test: 'hi'})
    });
  }
);

app.use(router.routes());

app.listen(port);

console.log('listening on port ' + port);

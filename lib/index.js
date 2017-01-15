import Koa from 'koa';
import Marko from 'marko';
import { Api } from './socket';

let server = new Koa();
let mntBlogTmpl = Marko.load(require.resolve('../templates/index.html'));

const port = 3001;

let api = new Api();

server.use(async (ctx, next) => {
  return api.getInitialState(ctx.request.url)
    .then(initial_state => {
      ctx.body = mntBlogTmpl.stream({initial_state}); 
      next();
    }); 
});

api.connect().then(start);

function start() {
  server.listen(port);
  console.log('listening on port ' + port);
}

import * as Koa from 'koa';
import * as http from 'http';

export class Server {
  public server = new Koa();

  constructor() {
    this.server.keys = ['soehnke standheims'];
  }

  public use(middlewares: Koa.Middleware[]) {
    middlewares.forEach(m => this.server.use(m));
    return this;
  }

  public start(port: number = 3000): http.Server {
    console.info(`listening on port ${port}`);
    return this.server.listen(port);
  }
}

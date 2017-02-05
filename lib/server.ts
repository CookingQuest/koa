import * as Koa from 'koa';
import { ApiMiddleware } from './apiMiddleware';
import { RenderMiddleware } from './renderMiddleware';

export class Server {
  private api = new ApiMiddleware();
  protected server = new Koa();

  constructor(private render: RenderMiddleware) {
    this.server.keys = ['soehnke standheims'];
  }

  protected init(): void {
    this.server.use(this.api.use);
    this.server.use(this.render.use);
  }

  public start(): void {
    const port = 3000;
    this.api.init().then(() => {
      this.server.listen(port);
      console.log(`listening on port ${port}`);
    });
  }
}

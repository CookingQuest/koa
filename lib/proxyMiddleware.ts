import { Context } from 'koa';
import * as httpProxy from 'http-proxy';

export class ProxyMiddleware {
  private proxy: any = new httpProxy.createProxyServer(
    {target: {host: 'localhost', port: 4000}}
  );

  public use(ctx: Context, next: () => Promise<any>): any {
    if(ctx.path.startsWith('socket/')){
      this.proxy.web(ctx.req, ctx.res);
    } else {
      next()
    }
  };

  public upgradeWebsocket(req: any, socket: any, head: any) {
    this.proxy.ws(req, socket, head);
  }
}

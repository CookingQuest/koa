import { Context, Middleware } from 'koa';
import * as httpProxy from 'http-proxy';

export class ProxyMiddleware {
  private proxy: any = new httpProxy.createProxyServer(
    {target: {host: 'localhost', port: 4000}}
  );

  public use(): Middleware {
    return async (ctx: Context, next: () => Promise<any>) => {
      if(ctx.path.startsWith('socket/')){
        this.proxy.web(ctx.req, ctx.res);
      } else await next();
    }
  };

  public upgradeWebsocket(req: any, socket: any, head: any) {
    this.proxy.ws(req, socket, head);
  }
}

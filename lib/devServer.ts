import { Middleware } from 'koa'
import { ProxyMiddleware } from './proxyMiddleware';
import { DevRenderMiddleware } from './devRenderMiddleware';
import { Server } from './server';

import { compiler } from 'webpack';

export class DevServer extends Server {

  constructor(compiler: compiler.Compiler, private webpackMiddleware: Middleware) {
    super(new DevRenderMiddleware(compiler));
    this.init();
  }

  protected init(): void {
    let proxy = new ProxyMiddleware();
    this.server.on('upgrade', proxy.upgradeWebsocket);
    this.server.use(proxy.use);
    this.server.use(this.webpackMiddleware);
    super.init()
  }
}

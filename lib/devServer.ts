import { Middleware } from 'koa'
import * as webpack from 'webpack';

import { ProxyMiddleware } from './proxyMiddleware';
import { DevRenderMiddleware } from './devRenderMiddleware';
import { Server } from './server';
import { Backend } from './backend';
import { ApiMiddleware } from './apiMiddleware';

export class DevServer extends Server {

  constructor(webpackMiddleware: Middleware) {
    super();
    const proxy = new ProxyMiddleware();
    this.use([
      proxy.use(),
      webpackMiddleware
    ]);
    this.server.on('upgrade', proxy.upgradeWebsocket);
  }

  async connect(compiler: webpack.Compiler, apiBackend?: Backend) {
    const api = await ApiMiddleware(apiBackend);
    this.use([api, DevRenderMiddleware(compiler)]);
    return this;
  }
}

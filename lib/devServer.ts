import * as webpack from 'webpack';
import * as webpackMiddleware from 'koa-webpack';

import { ProxyMiddleware } from './proxyMiddleware';
import { DevRenderMiddleware } from './devRenderMiddleware';
import { Server } from './server';
import { Backend } from './backend';
import { ApiMiddleware } from './apiMiddleware';

export const start = async (opts: DevServerOpts, apiBackend?: Backend, port?: number) => {
  const proxy = new ProxyMiddleware();
  const api = await ApiMiddleware(apiBackend);
  const server = new Server().use([
    proxy.use(),
    webpackMiddleware(opts),
    api, DevRenderMiddleware(opts.compiler)
  ]);
  server.server.on('upgrade', proxy.upgradeWebsocket);
  return await server.start(port);
}

interface DevServerOpts {
  compiler: webpack.Compiler;
  config: Object;
  dev: Object;
}

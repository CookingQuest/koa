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
  const middleware = webpackMiddleware({...opts, dev: getDevOpts(opts)});
  const server = new Server().use([
    proxy.use(),
    middleware,
    api, DevRenderMiddleware(opts.compiler)
  ]);
  server.server.on('upgrade', proxy.upgradeWebsocket);
  await new Promise(resolve => middleware.dev.waitUntilValid(resolve));
  return await server.start(port);
}

interface DevServerOpts {
  compiler: webpack.Compiler;
  config: any,
  dev?: any
}

const getDevOpts = (opts: DevServerOpts) => {
  const defaultOpts = {
    noInfo: true,
    stats: { colors: true, chunks: false },
    watchOptions: { aggregateTimeout: 300, poll: 1000 },
    index: 'notInUse',
    serverSideRender: true
  };
  return {...defaultOpts, ...opts.dev};
}

  

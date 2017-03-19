import { ContextualTestContext } from 'ava';
import { Context, Middleware } from 'koa';
// import * as getPort from 'get-port';
import * as webpack from 'webpack';

import { Server } from '../../lib/server';
import { Backend } from '../../lib/backend';

export const testMiddleware = (ctx: Context) => ctx.body = testObjectString;
export const stateSetter = async (ctx: Context, next: Function) => {
  ctx.state.initialState = testObject;
  await next();
};
export async function createServer(t: ContextualTestContext, ...middlewares: Middleware[]) {
  let port = 8000;
  let server = await new Server().use(middlewares).start(port);
  t.context.server = server;
  return server;
}

export function createServe(...middlewares: Middleware[]) {
  let server = new Server().use(middlewares).start(8000);
  return server;
}

export async function createServ(...middlewares: Middleware[]) {
  let server = new Server().use(middlewares).start(8001);
  return Promise.resolve(server);
}

export const mockBackend: Backend = {
  connect: () => Promise.resolve({}),
  getInitialState: (route: string, userHash: string) => Promise.resolve(testObject)
}

const testObject: object = {test: 'test'};
export const testObjectString: string = JSON.stringify(testObject);
export const mockCompiler = <webpack.Compiler> {
  outputFileSystem: {
    readFile: (_path: string, cb: Function) => cb(undefined, '<div>${data.initialState}</div>')
  },
  plugin: (a: string, b: any): void => {},
  watch: (a: any, b: any): void => {}
};

export const config = {
  context: __dirname,
  entry: './entry.js',
  output: { path: '/', filename: 'bundle.js', publicPath: '/' }
};

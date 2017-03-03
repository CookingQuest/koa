import { ContextualTestContext } from 'ava';
import { Context, Middleware } from 'koa';
import * as getPort from 'get-port';
import * as webpack from 'webpack';
import * as Path from 'path';

import { Server } from '../../lib/server';
import { Backend } from '../../lib/backend';

export const testMiddleware = (ctx: Context) => ctx.body = testObjectString;
export const stateSetter = async (ctx: Context, next: Function) => {
  ctx.state.initialState = testObject;
  await next();
};
export async function createServer(t: ContextualTestContext, ...middlewares: Middleware[]) {
  let port = await getPort();
  let server = new Server().use(middlewares).start(port);
  t.context.server = server;
  return server;
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
  context: Path.resolve(__dirname),
  entry: './entry',
  output: { path: Path.resolve(__dirname), filename: 'entry.js', publicPath: '/' }
};


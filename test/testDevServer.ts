import * as request from 'supertest';
import { Context, Middleware } from 'koa';
import test from 'ava';

import { DevRenderMiddleware } from '../lib/devRenderMiddleware';
import { DevServer } from '../lib/devServer';
import { createServer, mockCompiler, mockBackend,
         testObjectString, stateSetter } from './util/util';

test.afterEach((t) => t.context.server.close());

test('devRender should work', async (t) => {
  const server = await createServer(t, stateSetter, DevRenderMiddleware(mockCompiler));
  const response = await request(server).get('');
  t.is(response.text, `<div>${testObjectString}</div>`);
});

test('devServer should work', async (t) => {
  const noop: Middleware = async (_ctx: Context, next: () => Promise<any>) => await next();
  const server = (await new DevServer(noop).connect(mockCompiler, mockBackend)).start();
  t.context.server = server;
  const response = await request(server).get('');
  t.is(response.text, `<div>${testObjectString}</div>`);
});

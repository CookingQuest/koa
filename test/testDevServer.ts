import * as request from 'supertest';
import test from 'ava';
import * as webpack from 'webpack';
import * as getPort from 'get-port';
import * as webpackMiddleware from 'koa-webpack';

import { DevRenderMiddleware } from '../lib/devRenderMiddleware';
import { start } from '../lib/devServer';
import { createServer, mockCompiler, mockBackend,
         testObjectString, stateSetter, config } from './util/util';

test.afterEach((t) => t.context.server.close());

test('devRender should work', async (t) => {
  const server = await createServer(t, stateSetter, DevRenderMiddleware(mockCompiler));
  const response = await request(server).get('');
  t.is(response.text, `<div>${testObjectString}</div>`);
});

test.skip('devServer should work', async (t) => {
  const server = await start({compiler: webpack(config), config},
                             mockBackend, await getPort());
  t.context.server = server;
  const response = await request(server).get('entry.js');
  t.is(response.status, 200);
});

test('koa-webpack should work', async (t) => {
  let middleware = webpackMiddleware({compiler: webpack(config)});
  const server = await createServer(t, middleware);
  await new Promise(resolve => middleware.dev.waitUntilValid(resolve));
  const response = await request(server).get('/entry.js');
  t.is(response.status, 200)
  t.is(response.header['content-length'], '2543')
});

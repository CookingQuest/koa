import * as request from 'supertest';
import test from 'ava';
import * as webpack from 'webpack';
import * as getPort from 'get-port';

import { DevRenderMiddleware } from '../lib/devRenderMiddleware';
import { start } from '../lib/devServer';
import { createServer, mockCompiler, mockBackend,
         testObjectString, stateSetter } from './util/util';

test.afterEach((t) => t.context.server.close());

test('devRender should work', async (t) => {
  const server = await createServer(t, stateSetter, DevRenderMiddleware(mockCompiler));
  const response = await request(server).get('');
  t.is(response.text, `<div>${testObjectString}</div>`);
});

test('devServer should work', async (t) => {
  const server = await start(serverOpts, mockBackend, await getPort());
  t.context.server = server;
  const response = await request(server).get('');
  t.is(response.status, 200);
});

const serverOpts = {compiler: webpack({
    context: `${__dirname}/util`,
    entry: './index',
    output: {
      path: `${__dirname}/dist`,
        filename: 'index.html'
    }
}), config: {output: 'test/dist'}, dev: {publicPath: `${__dirname}/dist`}};

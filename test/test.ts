import * as request from 'supertest';
import { Context } from 'koa';
import test from 'ava';

import { ProxyMiddleware } from '../lib/proxyMiddleware';
import { ApiMiddleware } from '../lib/apiMiddleware';
import { RenderMiddleware } from '../lib/renderMiddleware';
import { createServer, testMiddleware, mockBackend,
         testObjectString, stateSetter } from './util/util';

test.afterEach((t) => t.context.server.close());

test('basic function', async (t) => {
  let server = await createServer(t, testMiddleware);
  let response = await request(server).get('');
  t.is(response.text, testObjectString);
});


test('proxy should proxy socket', async (t) => {
  let server = await createServer(t, new ProxyMiddleware().use(), testMiddleware);
  return new Promise(resolve => request(server).get('socket/').end(err => {
    t.is(err.message, 'ECONNREFUSED: Connection refused');
    resolve();
  }));
});

test('proxy should let others thru', async (t) => {
  let server = await createServer(t, new ProxyMiddleware().use(), testMiddleware);
  let response = await request(server).get('');
  t.is(response.text, testObjectString);
});

test('api should work', async (t) => {
  let api = await ApiMiddleware(mockBackend);
  let bodySetter = (ctx: Context) => ctx.body = ctx.state.initialState;
  let server = await createServer(t, api, bodySetter);
  let response = await request(server).get('');
  t.is(response.text, testObjectString);
});

test('render should work', async (t) => {
  let server = await createServer(t, stateSetter, RenderMiddleware('test/util/testTmpl.marko'));
  let response = await request(server).get('');
  t.is(response.text, `<div>${testObjectString}</div>`);
});

test('combined should work', async (t) => {
  let api = await ApiMiddleware(mockBackend);
  let server = await createServer(
    t, new ProxyMiddleware().use(), api, RenderMiddleware('test/util/testTmpl.marko')
  );
  let response = await request(server).get('');
  t.is(response.text, `<div>${testObjectString}</div>`);
});

test('combined should proxy', async (t) => {
  let api = await ApiMiddleware(mockBackend);
  let server = await createServer(
    t, new ProxyMiddleware().use(), api, RenderMiddleware('test/util/testTmpl.marko')
  );
  return new Promise(resolve => request(server).get('socket/').end(err => {
    t.is(err.message, 'ECONNREFUSED: Connection refused');
    resolve();
  }));
});

import { Server } from './server';
import { RenderMiddleware } from './renderMiddleware';
import { ApiMiddleware } from './apiMiddleware';

createServer().then((server) => server.start());

async function createServer() {
  const api = await ApiMiddleware();
  return new Server().use([
    api, RenderMiddleware('../templates/index.marko')
  ]);
}

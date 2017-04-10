import { Server } from './server';
import { RenderMiddleware } from './renderMiddleware';
import { ApiMiddleware } from './apiMiddleware';

import { PhoenixBackend } from './backend';

createServer().then((server) => server.start(3001));

async function createServer() {
  const backend = new PhoenixBackend()
  backend.connect().catch(() => {
    console.error('api offline');
    process.exit()
  });
  const api = await ApiMiddleware(backend);
  return new Server().use([
    api, RenderMiddleware('templates/index.marko')
  ]);
}

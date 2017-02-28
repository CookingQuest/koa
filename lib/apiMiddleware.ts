import { Context, Middleware } from 'koa';

import { PhoenixBackend, Backend } from './backend';

export const ApiMiddleware = async (backend: Backend = new PhoenixBackend()): Promise<Middleware> => {
  await backend.connect().catch(() => {
    console.error('api offline');
    process.exit()
  });

  return async (ctx: Context, next: () => Promise<any>): Promise<any> => {
    // let user = ctx.cookies.get('user', { signed: true });
    const initialState = await backend.getInitialState(ctx.request.url, 'user')
    ctx.state.initialState = initialState;
    await next();
  }
}

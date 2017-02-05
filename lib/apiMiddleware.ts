import { Context } from 'koa';

import { Api } from './socket';


export class ApiMiddleware {
  api: Api = new Api();

  async init(): Promise<object> {
    return this.api.connect();
  }

  use(ctx: Context, next: () => Promise<any>): any {
    let user = ctx.cookies.get('user', { signed: true });
    this.api.getInitialState(ctx.request.url, user)
      .then(initialState => {
        ctx.state.initialState = JSON.stringify(initialState);
        next();
      });
  }
}

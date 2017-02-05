import { Context } from 'koa';

export class RenderMiddleware {

  constructor(protected template: any) {}

  use(ctx: Context, _next: () => Promise<any>): any {
    ctx.type = 'text/html';
    ctx.body = this.template.stream({initialState: ctx.state.initialState});
  };
}

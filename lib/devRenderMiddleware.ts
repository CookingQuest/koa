import { Context } from 'koa';
import Marko from 'marko';
import * as path from 'path';

import { RenderMiddleware } from './renderMiddleware';

export class DevRenderMiddleware extends RenderMiddleware {
  private readonly indexPath: string;

  constructor(private compiler: any) {
    super(path.join(__dirname, 'tmp/tmpl.marko'));
    this.indexPath = path.join(compiler.outputPath, 'index.html');
  }

  public use(ctx: Context, _next: () => Promise<any>): any {
    ctx.type = 'text/html';
    this.readIndexFile(file => {
      const template = Marko.load(this.template, file.toString(), {writeToDisk: false});
      ctx.body = template.stream({initialState: ctx.state.initialState});
    });
  };

  private readIndexFile(cb: (file: any) => any) {
    this.compiler.outputFileSystem.readFile(path, (_: any, file: any) => cb(file));
  }
}

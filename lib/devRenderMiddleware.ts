import { Context, Middleware } from 'koa';
import * as Marko from 'marko';
import * as webpack from 'webpack';

export const DevRenderMiddleware = (compiler: webpack.Compiler): Middleware => {
  const errorFile = 'server/tmp/tmpl.marko';
  return async (ctx: Context): Promise<any> => {
    ctx.type = 'text/html';
    const file = await readIndexFile(compiler, 'index.html');
    const template = Marko.load(errorFile, file.toString(), {writeToDisk: false});
    ctx.body = template.stream({initialState: JSON.stringify(ctx.state.initialState)});
  };
}

async function readIndexFile(compiler: webpack.Compiler, path: string): Promise<any> {
  return new Promise(
    (resolve) => compiler.outputFileSystem
      .readFile(path, (_: any, file: any) => resolve(file))
  );
}

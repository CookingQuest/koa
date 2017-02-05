import Marko from 'marko';

import { Server } from './server';
import { RenderMiddleware } from './renderMiddleware';

const template = Marko.load(require.resolve('../templates/index.html'));
const renderMiddleware = new RenderMiddleware(template);
new Server(renderMiddleware).start();

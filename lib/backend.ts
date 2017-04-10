import { w3cwebsocket as ws } from 'websocket';
import { Socket, Channel } from '../lib/phoenix';

export class PhoenixBackend implements Backend {
  channel: Channel;

  async connect(): Promise<object> {
    const socket = new Socket('ws://localhost:4000/socket', { transport: ws });
    socket.connect();
    this.channel = socket.channel('state', {});
    return new Promise((resolve, reject) => this.channel.join(1000)
      .receive('ok', resolve)
      .receive('timeout', reject));
  }

  async getInitialState(route: string, userHash: string): Promise<object> {
    return new Promise(resolve => this.channel.push(
      'get', { route, user_hash: userHash }, 5000
    ).receive('ok', ({ data }) => resolve(data)));
  }

  async register(token: string): Promise<boolean> {
    return new Promise<boolean>(resolve => resolve(false));
  }

}

export interface Backend {
  connect(): Promise<object>;
  getInitialState(route: string, userHash: string): Promise<object>;
  register(token: string): Promise<boolean>;
}

import { w3cwebsocket as ws } from 'websocket';
import { Socket, Channel } from '../lib/phoenix';

export class PhoenixBackend implements Backend {
  channel: Channel;

  async connect(): Promise<void> {
    const url = process.env.NODE_ENV === 'prod' ? 'phoenix' : 'localhost:4000';
    const socket = new Socket(`ws://${url}/socket`, { transport: ws });
    return new Promise<void>((resolve) => {
      socket.onOpen(() => {
        this.openChannels(socket, resolve);
        console.log('api connected');
        socket.onOpen(() => console.log('api connected'));
      });
      socket.onError((err: object) => console.log(`api offline @${url}: ${JSON.stringify(err)}`))
      socket.connect();
    });
  }

  openChannels(socket: Socket, resolve: () => void): void {
    this.channel = socket.channel('state', {});
    this.channel.join(1000).receive('ok', resolve);
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
  connect(): Promise<void>;
  getInitialState(route: string, userHash: string): Promise<object>;
  register(token: string): Promise<boolean>;
}

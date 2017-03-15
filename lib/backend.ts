import { w3cwebsocket as ws } from 'websocket';
import { Socket, Channel } from '../lib/phoenix';

export class PhoenixBackend implements Backend {
  socket: Socket = new Socket('ws://localhost:4000/socket', {transport: ws});
  channel: Channel;


  async connect(): Promise<object> {
    this.socket.connect();
    this.channel = this.socket.channel('api', {});
    return new Promise((resolve, reject) => this.channel.join(1000)
                       .receive('ok', resolve)
                       .receive('timeout', reject));
  }

  async getInitialState(route: string, userHash: string): Promise<object> {
    return new Promise(
      resolve => this.channel.push('call', {method: 'initial_state', params: [{route, userHash}]}, 5000)
        .receive('ok', ({data}) => resolve(data))
    );
  }

}

export interface Backend {
  connect(): Promise<object>;
  getInitialState(route: string, userHash: string): Promise<object>;
}

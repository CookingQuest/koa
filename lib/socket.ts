import { w3cwebsocket as ws } from 'websocket';
import { Socket, Channel } from '../lib/phoenix';

export class Api {
  socket: Socket = new Socket('ws://localhost:4000/socket', {transport: ws});
  channel: Channel;


  async connect(): Promise<object> {
    this.socket.connect();
    this.channel = this.socket.channel('graphql', {});
    return new Promise(resolve => this.channel.join().receive('ok', resolve));
  }

  getInitialState(route: string, userHash: string): Promise<object> {
    return new Promise(
      resolve => this.channel.push('initial_state', {route, userHash}, 5000)
        .receive('ok', ({data}) => resolve(data))
    );
  }

}

import { w3cwebsocket as ws } from 'websocket';
import { Socket } from './phoenix';

export class Api {
  
  constructor() {
    this.socket = new Socket('ws://localhost:4000/socket', {transport: ws}); 
  }

  connect() {
    this.socket.connect(); 
    this.channel = this.socket.channel('app:graphql', {});
    return new Promise(resolve => this.channel.join().receive('ok', resolve)); 
  }; 
  
  getInitialState(route) {
    return new Promise(
      resolve => this.channel.push('initial_state', route, 10000)
        .receive("ok", ({data}) => resolve(data))
    ); 
  }

}

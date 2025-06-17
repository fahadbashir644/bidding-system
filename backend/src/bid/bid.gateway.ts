import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class BidGateway {
  @WebSocketServer()
  server: Server;

  sendBidUpdate(data: any) {
    this.server.emit('bidUpdate', data);
  }
}

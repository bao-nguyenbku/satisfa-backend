import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SatisgiService } from '~/module/private/satisgi/satisgi.service';

@WebSocketGateway({
  cors: true,
})
export class Gateway
  implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly satisgiService: SatisgiService) {}
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Socket is connected: ', socket.id);
    });
  }
  async handleConnection(client: Socket) {
    client.on('join-room', (room) => {
      console.log('Joinning....', room);
      client.join(room);
    });
  }
  async handleDisconnect(client: Socket) {
    console.log('Disconnected client:', client.id);
    client.disconnect();
  }
  @SubscribeMessage('chat')
  async onNewMessage(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(client.id).emit('onMessage', 'Hello');
  }

  @SubscribeMessage('disconnect')
  onDisconnect(@ConnectedSocket() client: Socket) {
    console.log('Disconnected:', client);
  }
}

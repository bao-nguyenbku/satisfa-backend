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
// import { SatisgiService } from '~/module/private/satisgi/satisgi.service';
import { UsersService } from '~/module/common/users/user.service';
import { POS_ROOM } from '~/constants';
import { ReservationEntity } from '~/module/private/reservations/entities/reservation.entity';

@WebSocketGateway({
  cors: true,
})
export class Gateway
  implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(private readonly userService: UsersService) {}
  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Socket is connected: ', socket.id);
    });
  }
  async handleConnection(client: Socket) {
    client.on('join-pos-room', () => {
      client.join(POS_ROOM);
    });
  }
  async handleDisconnect(client: Socket) {
    console.log('Disconnected client:', client.id);
    client.leave(POS_ROOM);
    client.disconnect();
  }
  @SubscribeMessage('call-waiter')
  async onNewMessage(
    @MessageBody()
    body: {
      userId: string;
      reservations: ReservationEntity[];
    },
    @ConnectedSocket() client: Socket,
  ) {
    const user = await this.userService.findById(body.userId);
    if (user) {
      this.server.to(POS_ROOM).emit('onServe', {
        user,
        type: 'CALL_WAITER',
        reservations: body.reservations,
      });
    }
  }

  @SubscribeMessage('disconnect')
  onDisconnect(@ConnectedSocket() client: Socket) {
    console.log('Disconnected:', client);
    client.disconnect();
  }
}

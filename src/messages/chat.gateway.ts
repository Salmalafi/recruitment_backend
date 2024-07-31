import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('sendMessage')
async handleMessage(
  @MessageBody() message: {
    senderId: string; 
    senderRole: 'HrAgent' | 'Candidate';
    receiverId: string; 
    receiverRole: 'HrAgent' | 'Candidate';
    content: string;
  },
  @ConnectedSocket() client: Socket,
): Promise<void> {
  try {
    const createdMessage = await this.messagesService.createMessage(
      message.senderId,
      message.senderRole,
      message.receiverId,
      message.receiverRole,
      message.content,
    );
    this.server.emit('receiveMessage', createdMessage);
    client.emit('messageAcknowledgment', { success: true });
  } catch (error) {
    console.error('Error handling message:', error);
    client.emit('messageAcknowledgment', { success: false, error: 'Failed to send message' }); 
  }
}

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket): void {
    client.join(room);
    client.emit('joinedRoom', room);
  }
}

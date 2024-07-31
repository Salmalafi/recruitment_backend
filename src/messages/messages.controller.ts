import { Controller, Post, Body, Get, BadRequestException, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Message } from './messages.entity';
import { ObjectId } from 'mongodb';
import { Public } from 'src/auth/auth.controller';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Public()
  @Post()
  async createMessage(
    @Body('senderId') senderId: string,
    @Body('senderRole') senderRole: 'HrAgent' | 'Candidate',
    @Body('receiverId') receiverId: string,
    @Body('receiverRole') receiverRole: 'HrAgent' | 'Candidate',
    @Body('content') content: string,
  ) {
    try {
      await this.messagesService.createMessage(
        senderId,
        senderRole,
        receiverId,
        receiverRole,
        content
      );
    } catch (error) {
      console.error('Error creating message:', error);
      throw new BadRequestException('Error creating message');
    }
  }

  @Get(':senderId/:receiverId')
  async getMessages(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
  ): Promise<Message[]> {
    try {
      // If senderId and receiverId are strings, remove ObjectId validation
      return await this.messagesService.getMessages(senderId, receiverId);
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new BadRequestException('Error fetching messages');
    }
  }
}

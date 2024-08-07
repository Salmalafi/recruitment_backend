import { Controller, Post, Body, Get, BadRequestException, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Message } from './messages.entity';
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
      const timestamp = new Date().toISOString(); 
      console.log(timestamp);
      await this.messagesService.createMessage(
        senderId,
        senderRole,
        receiverId,
        receiverRole,
        content,
        timestamp, 
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
      return await this.messagesService.getMessages(senderId, receiverId);
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new BadRequestException('Error fetching messages');
    }
  }

  @Get(':senderId')
  async getCandidateMessages(
    @Param('senderId') senderId: string,
  ): Promise<Message[]> {
    try {
      return await this.messagesService.getCandidateMessages(senderId);
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new BadRequestException('Error fetching messages');
    }
  }
}


// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './messages.entity';
import { MessagesService } from './messages.service';
import { ChatGateway } from './chat.gateway';
import { MessagesController } from './messages.controller';

@Module({
  imports: [
  TypeOrmModule.forFeature([Message]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, ChatGateway],
})
export class MessagesModule {}

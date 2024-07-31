// message.entity.ts
import { Entity, Column, CreateDateColumn, ObjectIdColumn, } from 'typeorm';
import {ObjectId } from 'mongodb';
@Entity()
export class Message {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  senderId:String;

  @Column()
  receiverId: String;

  @Column()
  senderRole: 'HrAgent' | 'Candidate';

  @Column()
  receiverRole: 'HrAgent' | 'Candidate';

  @Column()
  content: string;

  @CreateDateColumn()
  timestamp: Date;
}

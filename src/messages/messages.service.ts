import { Injectable, BadRequestException } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

@Injectable()
export class MessagesService {
  private client: MongoClient;
  private db: Db;
  private readonly dbName = 'test'; 
  private readonly collectionName = 'message';

  constructor() {
    this.client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);

    this.client.connect()
      .then(() => {
        this.db = this.client.db(this.dbName);
      })
      .catch(err => {
        console.error('Failed to connect to MongoDB', err);
        throw new BadRequestException('Database connection error');
      });
  }
  async createMessage(
    senderId: string,
    senderRole: 'HrAgent' | 'Candidate',
    receiverId: string,
    receiverRole: 'HrAgent' | 'Candidate',
    content: string,
    timestamp: string 
  ): Promise<any> { 
    if (senderRole === 'Candidate' && receiverRole === 'Candidate') {
      throw new BadRequestException('Candidates cannot message each other.');
    }
  
    const collection = this.db.collection(this.collectionName);
  
    try {
      const newMessage = {
        senderId,
        senderRole,
        receiverId,
        receiverRole,
        content,
        timestamp: new Date(timestamp), 
      };
  
      const result = await collection.insertOne(newMessage);
      const createdMessage = await collection.findOne({ _id: result.insertedId });
  
      return createdMessage; 
    } catch (error) {
      console.error('Error creating message:', error);
      throw new BadRequestException('Error creating message');
    }
  }
  
  
  async getMessages(senderId: String, receiverId: String): Promise<any[]> {
    const collection = this.db.collection(this.collectionName);

    try {
      const messages = await collection.find({
        $or: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      }).sort({ timestamp: 1 }).toArray();

      return messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new BadRequestException('Error fetching messages');
    }
  }
  async getCandidateMessages(senderId: String): Promise<any[]> {
    const collection = this.db.collection(this.collectionName);

    try {
      const messages = await collection.find({
        $or: [
          { senderId: senderId },
          { receiverId: senderId },
        ],
      }).sort({ timestamp: 1 }).toArray();

      return messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new BadRequestException('Error fetching messages');
    }
  }
}

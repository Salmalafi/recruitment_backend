import { Injectable, BadRequestException } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

@Injectable()
export class MessagesService {
  private client: MongoClient;
  private db: Db;
  private readonly dbName = 'test'; // Replace with your actual database name
  private readonly collectionName = 'message';

  constructor() {
    // Initialize MongoDB client
    this.client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);

    // Connect to MongoDB
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
    receiverId: String,
    receiverRole: 'HrAgent' | 'Candidate',
    content: string,
  ): Promise<void> {
    // Enforce communication rules
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
        timestamp: new Date(), // Ensure you include a timestamp
      };
      await collection.insertOne(newMessage);
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
}

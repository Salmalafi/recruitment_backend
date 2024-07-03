/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class Blogpost {
  @ObjectIdColumn() // Unique for MongoDB
  _id: ObjectId;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: false })
  isPublished: boolean;

  @CreateDateColumn({type: 'timestamp'})
  createdAt: Date;

  @Column({ type: 'timestamp', default: null, nullable: true })
  updatedAt: Date;
}

import { ObjectId } from 'mongodb';
import { Entity, Column, ObjectIdColumn, ManyToOne, Unique, CreateDateColumn } from 'typeorm';
import { Offer } from 'src/offer/offer.entity';
import { User } from 'src/users/users.entity';
import { ApplicationStatus } from './status.enum';

@Entity()
@Unique(['userId', 'offerId'])
export class Application {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  resume: string;

  @ManyToOne(() => Offer, offer => offer.applications)
  offer: Offer;

  @ManyToOne(() => User, user => user.applications)
  user: User;

  @Column()
  userId: ObjectId;

  @Column({ nullable: true })
  motivationLetter?: string;

  @Column()
  offerId: ObjectId;

  @Column({ type: 'enum', enum: ApplicationStatus, default: ApplicationStatus.PENDING })
  status: ApplicationStatus;
  @CreateDateColumn()
  date: Date;
}

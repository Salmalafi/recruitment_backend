import { ObjectId } from 'mongodb';
import { Entity, Column, ObjectIdColumn, ManyToOne, Unique } from 'typeorm';
import { Offer } from 'src/offer/offer.entity';
import { User } from 'src/users/users.entity';

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
}




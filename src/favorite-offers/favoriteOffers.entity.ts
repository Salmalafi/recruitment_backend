import { ObjectId } from 'mongodb';
import { Offer } from 'src/offer/offer.entity';
import { User } from 'src/users/users.entity';
import { Entity, Column, ObjectIdColumn, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class FavoriteOffers {
  @ObjectIdColumn()
  _id: ObjectId

  @Column() 
  userId: ObjectId;

  @Column() 
  offerId: ObjectId;

  @ManyToOne(() => User, user => user.favorites)
  user: User;

  @ManyToOne(() => Offer, offer => offer.favorites)
  offer: Offer;

  @CreateDateColumn()
  createdAt: Date;
}

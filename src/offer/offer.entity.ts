// src/offers/entities/offer.entity.ts
import { Application } from 'src/application/application.entity';
import { Entity, Column, ObjectIdColumn, OneToMany } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity()
export class Offer {
  @ObjectIdColumn()
  _id: ObjectId;
  @Column()
  reference: string;

  @Column()
  title: string;

  @Column()
  contractType: string;

  @Column()
  location: string;

  @Column()
  maxDate: Date;

  @Column()
  jobDescription: string;

  @Column()
  profilCherche: string;

  @Column()
  whatWeOffer: string;

  @OneToMany(() => Application, application => application.offer)
  applications: Application[];
}

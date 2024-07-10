// src/offers/entities/offer.entity.ts
import { Application } from 'src/application/application.entity';
import { Entity, Column, ObjectIdColumn, OneToMany, CreateDateColumn } from 'typeorm';
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

  @Column()
  skillsRequired: string[]; 

  @Column()
  experience: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date; 

  @OneToMany(() => Application, application => application.offer)
  applications: Application[];
}

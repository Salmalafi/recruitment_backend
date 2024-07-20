/* eslint-disable prettier/prettier */
import { ObjectId } from 'mongodb';
import { BaseEntity, Column, CreateDateColumn, Entity, ObjectIdColumn, OneToMany } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Application } from 'src/application/application.entity';
import { FavoriteOffers } from 'src/favorite-offers/favoriteOffers.entity';

@Entity()
export class User extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @IsNotEmpty()
  @Column({ nullable: false })
  username: string;

  @IsNotEmpty()
  @Column({ nullable: false })
  firstName: string;

  @IsNotEmpty()
  @Column({ nullable: false })
  lastName: string;

  @IsNotEmpty()
  @Column({ nullable: false })
  password: string;

  @IsNotEmpty()
  @Column({ nullable: false })
  phone: string;

  @IsNotEmpty()
  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false })
  country: string;

  @Column()
  resumeUrl: string;

  @Column()
  profilePictureUrl: string;

  @Column({ default: "user" })
  role: string;

  @Column()
  linkedinProfile: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date;
  @Column({ default: null })
  resetPasswordToken: string;
  @Column({ default: false })
  subscribed: boolean;
  @Column({ default: null })
  resetPasswordExpires: Date;
  @Column({ nullable: true })
  linkedinId: string;
  @OneToMany(() => Application, application => application.user)
  applications: Application[];

  @OneToMany(() => FavoriteOffers, favoriteOffers => favoriteOffers.user)
  favorites: FavoriteOffers[];
}

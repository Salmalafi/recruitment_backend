/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { Repository, FindOneOptions } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService {

  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: Repository<User>,
  ) {}

  async create(newUser: User): Promise<User> {
    const user = new User();
    user.firstName = newUser.firstName;
    user.lastName = newUser.lastName;

    const saltRounds = 10;
    user.password = await bcrypt.hash(newUser.password, saltRounds);
user.role=newUser.role;
    user.email = newUser.email;
    user.phone = newUser.phone;
    user.country = newUser.country;
    user.address = newUser.address;
    user.isActive = true;
    user.createdAt = new Date();

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: any): Promise<User> {
    return this.usersRepository.findOne(id);
  }
  async getUserEmailById(userId: ObjectId): Promise<string> {
    try {
      const response = await axios.get(`http://localhost:3000/users/${userId}`);
      return response.data.email;
    } catch (error) {
      throw new Error('Failed to fetch user email');
    }
  }
  async findOneByOAuthId(oauthId: string, provider: string): Promise<User> {
    return this.usersRepository.findOne({ where: { [`${provider}Id`]: oauthId } });
  }

  async findByName(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username: username } });
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email: email } });
  }
 
  async createOAuthUser(profile: any, provider: string): Promise<User> {
    const user = new User();
    user.username = profile.displayName;
    user.email = profile.emails[0].value;
    user[`${provider}Id`] = profile.id;
    return this.usersRepository.save(user);
  }

  async remove(id: any): Promise<void> {
    await this.usersRepository.delete(id);
  }
}

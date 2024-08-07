import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, FindOneOptions } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import { ObjectId } from 'mongodb';
import { UpdateUserDto } from './dto/create-user.dto';
import { MailerService } from 'src/auth/nodemailer.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: Repository<User>,
    private mailerService: MailerService,
  ) {}

  async create(newUser: User): Promise<User> {
    const user = new User();
    user.firstName = newUser.firstName;
    user.lastName = newUser.lastName;

    const saltRounds = 10;
    user.password = await bcrypt.hash(newUser.password, saltRounds);
    user.role = newUser.role;
    user.email = newUser.email;
    user.phone = newUser.phone;
    user.country = newUser.country;
    user.address = newUser.address;
    user.isActive = true;
    user.createdAt = new Date();

    const savedUser = await this.usersRepository.save(user);

    if (user.role === 'HrAgent') {
      await this.mailerService.sendHrAgentWelcomeEmail(user.email, newUser.password);
    }

    return savedUser;
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

  async update(id: any, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    if (updateUserDto.phone) user.phone = updateUserDto.phone;
    if (updateUserDto.lastName) user.lastName = updateUserDto.lastName;
    if (updateUserDto.firstName) user.firstName = updateUserDto.firstName;
    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.isActive !== undefined) user.isActive = updateUserDto.isActive;
    if (updateUserDto.password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email: email } });
  }

  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    let userId;
    try {
      userId = new ObjectId(id);
    } catch (error) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = await this.usersRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.save(user);
    if (user.role === 'HrAgent') {
      await this.mailerService.sendPasswordChangedEmail(user.email, newPassword);
    }
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

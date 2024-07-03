/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Blogpost } from './entities/post.entity';

@Injectable()
export class PostService {
  
  constructor(
    @Inject('BLOGPOST_REPOSITORY')
    private postRepository: Repository<Blogpost>,
  ) {}

  create(newPost: Blogpost): Promise<Blogpost> {
    const blogpost = new Blogpost();
    blogpost.title        = newPost.title;
    blogpost.content      = newPost.content;
    blogpost.isPublished  = newPost.isPublished;
    blogpost.createdAt    = newPost.createdAt;
    blogpost.updatedAt    = newPost.updatedAt;

    return this.postRepository.save(blogpost);
  }

  async findAll(): Promise<Blogpost[]> {
    return this.postRepository.find();
  }
  findOne(id: any): Promise<Blogpost> {
    return this.postRepository.findOneBy({ _id: id });
  }
/*
  update(id: number, updatedPost: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }
*/
  findByName(username: string): Promise<Blogpost> {
    return this.postRepository.findOneBy({ title: username });
  }

  async remove(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }
}

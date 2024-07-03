/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { Blogpost } from './entities/post.entity'

@Controller('blogpost')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() newPost: Blogpost): Promise<Blogpost> {
    return this.postService.create(newPost);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }
/*
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }
*/
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}

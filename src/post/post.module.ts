/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { blogpostProviders } from './post.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...blogpostProviders,
    PostService,
  ],
  exports: [PostService],
  controllers: [PostController],
})
export class PostModule {}

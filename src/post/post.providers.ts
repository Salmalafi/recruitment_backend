/* eslint-disable prettier/prettier */
import { DataSource } from 'typeorm';
import { Blogpost } from './entities/post.entity';

export const blogpostProviders = [
  {
    provide: 'BLOGPOST_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Blogpost),
    inject: ['DATA_SOURCE'],
  },
];
// src/applications/dto/update-application.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationDto } from './createApplicationDto';

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {}

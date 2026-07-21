import { UserEntity } from '@auth/entities';
import { EntityManager } from 'typeorm';

export class CreateFileDto {
  file: Express.Multer.File;
  modelId: string;
  user: UserEntity;
  typeId?: string;
  folder: string;
  manager?: EntityManager;
}

export class CreateProcessFileDto {
  file: Express.Multer.File;
  modelId: string;
  user: UserEntity;
  typeId?: string;
  activity: string;
  manager?: EntityManager;
  ruc: string;
}

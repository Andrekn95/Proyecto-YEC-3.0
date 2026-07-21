import { Global, Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { fileProviders } from './file.providers';

@Global()
@Module({
  controllers: [FileController],
  providers: [...fileProviders, FileService],
  exports: [...fileProviders, FileService],
})
export class FileModule {}

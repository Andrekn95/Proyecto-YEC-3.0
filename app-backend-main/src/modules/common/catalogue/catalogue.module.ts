import { Global, Module } from '@nestjs/common';
import { CatalogueController } from './catalogue.controller';
import { catalogueProvider } from './catalogue.provider';
import { CataloguesService } from './catalogue.service';
import { CacheModule } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [CacheModule.register()],
  controllers: [CatalogueController],
  providers: [...catalogueProvider, CataloguesService],
  exports: [...catalogueProvider, CataloguesService],
})
export class CatalogueModule {}

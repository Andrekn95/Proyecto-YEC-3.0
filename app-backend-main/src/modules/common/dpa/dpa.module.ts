import { Global, Module } from '@nestjs/common';
import { DpaController } from './dpa.controller';
import { dpaProvider } from './dpa.provider';
import { DpaService } from './dpa.service';
import { CacheModule } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [CacheModule.register()],
  controllers: [DpaController],
  providers: [dpaProvider, DpaService],
  exports: [dpaProvider, DpaService],
})
export class DpaModule {}

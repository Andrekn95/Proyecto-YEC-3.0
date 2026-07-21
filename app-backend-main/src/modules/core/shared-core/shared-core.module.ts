import { Global, Module } from '@nestjs/common';
import { controllers } from '@modules/core/shared-core/controllers';
import { coreProviders } from '@modules/core/core.provider';
import { CacheModule } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [CacheModule.register()],
  controllers,
  providers: [...coreProviders],
  exports: [],
})
export class SharedCoreModule {}

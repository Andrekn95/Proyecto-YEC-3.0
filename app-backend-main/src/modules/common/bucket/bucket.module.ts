import { Module } from '@nestjs/common';
import { BucketService } from '@modules/common/bucket/bucket.service';

@Module({
  providers: [BucketService],
  exports: [BucketService],
})
export class BucketModule {}

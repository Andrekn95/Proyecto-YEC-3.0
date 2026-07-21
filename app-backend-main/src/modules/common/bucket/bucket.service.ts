import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreateBucketCommand,
  DeleteBucketCommandOutput,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { envConfig } from '@config';
import { ConfigType } from '@nestjs/config';
import { BucketInterface, UploadFileParams } from '@modules/common/bucket/bucket.interface';

@Injectable()
export class BucketService implements OnModuleInit, BucketInterface {
  private s3: S3Client;

  constructor(
    @Inject(envConfig.KEY)
    private configService: ConfigType<typeof envConfig>,
  ) {}

  async onModuleInit() {
    this.s3 = new S3Client({
      endpoint: `${this.configService.bucket.endPoint}:${this.configService.bucket.port}`,
      region: this.configService.bucket.region!,
      credentials: {
        accessKeyId: this.configService.bucket.accessKey!,
        secretAccessKey: this.configService.bucket.secretKey!,
      },
      forcePathStyle: true,
    });

    await this.ensure(this.configService.bucket.name!);
  }

  async ensure(bucket: string) {
    try {
      await this.s3.send(new HeadBucketCommand({ Bucket: bucket }));
    } catch (err: any) {
      await this.s3.send(new CreateBucketCommand({ Bucket: bucket }));
    }
  }

  async uploadFile({
    filePath,
    buffer,
    mimetype,
  }: UploadFileParams): Promise<PutObjectCommandOutput> {
    const command = new PutObjectCommand({
      Bucket: this.configService.bucket.name,
      Key: filePath,
      Body: buffer,
      ContentType: mimetype,
    });

    return await this.s3.send(command);
  }

  async uploadFiles(files: UploadFileParams[]): Promise<PutObjectCommandOutput[]> {
    const uploads = files.map((file) => {
      const command = new PutObjectCommand({
        Bucket: this.configService.bucket.name,
        Key: file.filePath,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      return this.s3.send(command);
    });

    return Promise.all(uploads);
  }

  async deleteFile(key: string): Promise<DeleteBucketCommandOutput> {
    const command = new DeleteObjectCommand({
      Bucket: this.configService.bucket.name,
      Key: key,
    });

    return this.s3.send(command);
  }

  async getObject(key: string): Promise<any> {
    const command = new GetObjectCommand({
      Bucket: this.configService.bucket.name,
      Key: key,
    });

    return (await this.s3.send(command)).Body;
  }

  async generatePresignedUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.configService.bucket.name,
      Key: key,
    });

    return await getSignedUrl(this.s3, command, {
      expiresIn: 60 * this.configService.bucket.presignedExpiry,
    });
  }
}

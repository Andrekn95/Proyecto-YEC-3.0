import { DeleteBucketCommandOutput, PutObjectCommandOutput } from '@aws-sdk/client-s3';

export interface BucketInterface {
  ensure(bucket: string): Promise<void>;
  generatePresignedUrl(fileName: string): Promise<string>;
  uploadFile({ filePath, buffer, mimetype }: UploadFileParams): Promise<PutObjectCommandOutput>;
  uploadFiles(files: UploadFileParams[]): Promise<PutObjectCommandOutput[]>;
  getObject(path: string): Promise<any>;
  deleteFile(path: string): Promise<DeleteBucketCommandOutput>;
}

export interface UploadFileParams {
  filePath: string;
  buffer: Buffer;
  mimetype: string;
}

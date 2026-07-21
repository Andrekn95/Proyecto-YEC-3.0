import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class TypeFileValidationPipe implements PipeTransform {
  transform(value: any) {
    // "value" is an object containing the file's attributes and metadata
    const oneKb = 1000;
    return value.size < oneKb;
  }

  // transform(value: any, metadata: ArgumentMetadata) {
  //   "value" is an object containing the file's attributes and metadata
  // const oneKb = 1000;
  // return value.size < oneKb;
  // }
}

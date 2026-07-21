import { PaginationInterface } from '@modules/auth/interfaces/paginator.interface';

export interface HttpResponseInterface {
  data: any;
  pagination?: PaginationInterface;
  error?: string;
  message: string;
  detail: string;
  statusCode: number;
  title: string;
  version?: string;
}

export interface ServerResponsePaginator extends HttpResponseInterface {
  meta: PaginationInterface;
  links?: Links;
}

interface Links {
  first: string;
  last: string;
  prev: string;
  next: string;
}

export interface ResponseHttpInterface<T = object | boolean | number | string | null | undefined> {
  data: T;
  message: string | string[];
  title: string;
  pagination?: T;
}
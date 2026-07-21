export interface ServiceResponseHttpInterface<
  T = object | boolean | number | string | null | [] | undefined,
> {
  data: T;
  pagination?: T;
}

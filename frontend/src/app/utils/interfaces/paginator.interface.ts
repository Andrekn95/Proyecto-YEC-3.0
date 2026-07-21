export interface PaginationInterface {
  page: number;
  firstItem?: number;
  lastPage?: number;
  limit: number;
  lastItem?: number;
  totalItems?: number;
}

export const INITIAL_PAGINATION: PaginationInterface = { page: 1, limit: 10 };

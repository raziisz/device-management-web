export interface PaginationMeta {
  currentPage: number;
  perPage: number;
  lastPage: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

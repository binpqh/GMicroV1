export interface IPage<T> {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  items: T[];
}

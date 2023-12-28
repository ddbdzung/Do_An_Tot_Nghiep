export interface GetTransactionsQueryDto {
  page: number;
  limit: number;
  sortBy: string;
  name: string;
  role: string;
}

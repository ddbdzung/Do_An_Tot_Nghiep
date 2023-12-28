export interface IGetProgressesQueryDto {
  limit?: number;
  page?: number;
  transactionId?: string;
  status?: string;
}

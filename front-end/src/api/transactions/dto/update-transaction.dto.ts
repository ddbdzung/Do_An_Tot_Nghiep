export interface IUpdateTransactionDto {
  body: IUpdateTransactionBodyDto;
  params: IUpdateTransactionParamsDto;
}

export interface IUpdateTransactionBodyDto {
  status: string;
}

export interface IUpdateTransactionParamsDto {
  id: string;
}

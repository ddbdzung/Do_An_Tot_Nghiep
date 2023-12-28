import { IGetTransactionParamsDto } from "../transactions/dto/get-transaction.dto";
import { GetTransactionsQueryDto } from "../transactions/dto/get-transactions.dto";
import { IUpdateTransactionParamsDto } from "../transactions/dto/update-transaction.dto";

export const CREATE_TRANSACTION = () => `/v1/transactions/me`;
export const GET_TRANSACTION_OF_ME = () => `/v1/transactions/me`;
export const GET_TRANSACTIONS = (val: GetTransactionsQueryDto) => {
  const { limit, page, name, role, sortBy } = val;
  let url = `/v1/transactions?`;
  if (limit) {
    url += `limit=${limit}&`;
  }
  if (page) {
    url += `page=${page}&`;
  }
  if (name) {
    url += `name=${name}&`;
  }
  if (role) {
    url += `role=${role}&`;
  }
  if (sortBy) {
    url += `sortBy=${sortBy}&`;
  }
  return url;
};
export const UPDATE_TRANSACTION = (val: IUpdateTransactionParamsDto) =>
  `/v1/transactions/${val.id}`;
export const GET_TRANSACTION = (val: IGetTransactionParamsDto) =>
  `/v1/transactions/${val.id}`;

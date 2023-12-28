import { ICreateTransactionDto } from "@/api/checkout/dto/create-transaction.dto";
import {
  CREATE_TRANSACTION,
  GET_TRANSACTION,
  GET_TRANSACTIONS,
  GET_TRANSACTION_OF_ME,
  UPDATE_TRANSACTION,
} from "@/api/checkout/endpoints";
import { IGetTransactionParamsDto } from "@/api/transactions/dto/get-transaction.dto";
import { IUpdateTransactionDto } from "@/api/transactions/dto/update-transaction.dto";
import { customAxios } from "@/http-service/fetchAPI";
import { AxiosError } from "axios";

export const fetchCreateTransaction = async (
  tokens: { access: string },
  payload: ICreateTransactionDto
) => {
  try {
    const { data } = await customAxios.post(
      CREATE_TRANSACTION(),
      payload,
      tokens
    );
    return data;
  } catch (errorResponse: any) {
    const { code, message, response } = errorResponse;
    if (code === AxiosError.ERR_NETWORK) {
      return { code, message };
    }

    return errorResponse.response.data;
  }
};

export const fetchGetTransactionOfMe = async (tokens: { access: string }) => {
  try {
    const { data } = await customAxios.get(
      GET_TRANSACTION_OF_ME(),
      null,
      tokens
    );
    return data;
  } catch (errorResponse: any) {
    const { code, message, response } = errorResponse;
    if (code === AxiosError.ERR_NETWORK) {
      return { code, message };
    }

    return errorResponse.response.data;
  }
};

export const fetchGetTransactions = async (
  tokens: { access: string },
  payload: GetTransactionsQueryDto
) => {
  try {
    const { data } = await customAxios.get(
      GET_TRANSACTIONS(payload),
      null,
      tokens
    );
    return data;
  } catch (errorResponse: any) {
    const { code, message, response } = errorResponse;
    if (code === AxiosError.ERR_NETWORK) {
      return { code, message };
    }

    return errorResponse.response.data;
  }
};

export const fetchUpdateTransaction = async (
  tokens: { access: string },
  payload: IUpdateTransactionDto
) => {
  try {
    const { data } = await customAxios.patch(
      UPDATE_TRANSACTION(payload.params),
      payload.body,
      tokens
    );
    return data;
  } catch (errorResponse: any) {
    const { code, message, response } = errorResponse;
    if (code === AxiosError.ERR_NETWORK) {
      return { code, message };
    }

    return errorResponse.response.data;
  }
};

export const fetchGetTransaction = async (
  tokens: { access: string },
  params: IGetTransactionParamsDto
) => {
  try {
    const { data } = await customAxios.get(
      GET_TRANSACTION(params),
      null,
      tokens
    );
    return data;
  } catch (errorResponse: any) {
    const { code, message, response } = errorResponse;
    if (code === AxiosError.ERR_NETWORK) {
      return { code, message };
    }

    return errorResponse.response.data;
  }
};

import { ICreateTransactionDto } from "@/api/checkout/dto/create-transaction.dto";
import {
  CREATE_TRANSACTION,
  GET_TRANSACTION_OF_ME,
} from "@/api/checkout/endpoints";
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

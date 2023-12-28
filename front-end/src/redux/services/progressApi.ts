import { IGetProgressesQueryDto } from "@/api/progress/dto/get-progresses.dto";
import { IUpdateProgressDto } from "@/api/progress/dto/update-progress.dto";
import {
  GET_PROGRESS,
  GET_PROGRESSES,
  UPDATE_PROGRESS,
} from "@/api/progress/endpoints";
import { customAxios } from "@/http-service/fetchAPI";
import { AxiosError } from "axios";

export const fetchGetProgresses = async (
  tokens: { access: string },
  query: IGetProgressesQueryDto
) => {
  try {
    const { data } = await customAxios.get(GET_PROGRESSES(query), null, tokens);
    return data;
  } catch (errorResponse: any) {
    const { code, message, response } = errorResponse;
    if (code === AxiosError.ERR_NETWORK) {
      return { code, message };
    }

    return errorResponse.response.data;
  }
};

export const fetchUpdateProgress = async (
  tokens: { access: string },
  payload: IUpdateProgressDto
) => {
  try {
    const { data } = await customAxios.put(
      UPDATE_PROGRESS(payload.params),
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

export const fetchGetProgress = async (
  tokens: { access: string },
  query: { id: string }
) => {
  try {
    const { data } = await customAxios.get(GET_PROGRESS(query), null, tokens);
    return data;
  } catch (errorResponse: any) {
    const { code, message, response } = errorResponse;
    if (code === AxiosError.ERR_NETWORK) {
      return { code, message };
    }

    return errorResponse.response.data;
  }
};

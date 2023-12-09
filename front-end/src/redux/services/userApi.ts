import { IUpdateMeBodyDto } from "@/api/user/dto/update-me.dto";
import { GET_ME, UPDATE_ME } from "@/api/user/endpoints";
import { customAxios } from "@/http-service/fetchAPI";
import { AxiosError } from "axios";

export async function fetchGetMe(tokens: any) {
  try {
    const { data } = await customAxios.get(GET_ME, null, tokens);
    return data;
  } catch (errorResponse: any) {
    const { code, message, response } = errorResponse;
    if (code === AxiosError.ERR_NETWORK) {
      return { code, message };
    }

    return errorResponse.response.data;
  }
}

export async function fetchUpdateMe(tokens: any, payload: IUpdateMeBodyDto) {
  try {
    const { data } = await customAxios.patch(UPDATE_ME, payload, tokens);
    return data;
  } catch (errorResponse: any) {
    const { code, message, response } = errorResponse;
    if (code === AxiosError.ERR_NETWORK) {
      return { code, message };
    }

    return errorResponse.response.data;
  }
}

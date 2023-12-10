import { ISignUpBodyDto } from "@/api/auth/dto/sign-up.dto";
import { SIGN_IN, SIGN_UP } from "@/api/auth/endpoints";
import { TOGGLE_FAVORITE_PRODUCT } from "@/api/user/endpoints";
import { customAxios } from "@/http-service/fetchAPI";
import { AxiosError } from "axios";

export async function fetchSignUp(payload: ISignUpBodyDto) {
  try {
    const { data } = await customAxios.post(SIGN_UP, payload);
    return data;
  } catch (errorResponse: any) {
    const { code, message, response } = errorResponse;
    if (code === AxiosError.ERR_NETWORK) {
      return { code, message };
    }

    return errorResponse.response.data;
  }
}

export async function fetchSignIn(payload: ISignUpBodyDto) {
  try {
    const { data } = await customAxios.post(SIGN_IN, payload);
    return data;
  } catch (errorResponse: any) {
    const { code, message, response } = errorResponse;
    if (code === AxiosError.ERR_NETWORK) {
      return { code, message };
    }

    return errorResponse.response.data;
  }
}

export async function fetchToggleFavouriteProduct(
  token: string,
  payload: string
) {
  try {
    const response = await customAxios.patch(
      TOGGLE_FAVORITE_PRODUCT(payload),
      null,
      token
    );
    return response.data;
  } catch (errorResponse: any) {
    const { code, message, response } = errorResponse;
    if (code === AxiosError.ERR_NETWORK) {
      return { code, message };
    }

    return errorResponse.response.data;
  }
}

import { ISignUpBodyDto } from "@/api/auth/dto/SignUp.dto";
import { SIGN_UP } from "@/api/auth/endpoints";
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

    return response.data;
  }
}

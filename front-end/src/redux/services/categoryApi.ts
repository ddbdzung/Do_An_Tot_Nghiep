import { IGetCategoriesQueryDto } from "@/api/category/dto/get-categories.dto";
import { GET_CATEGORIES } from "@/api/category/endpoints";
import { customAxios } from "@/http-service/fetchAPI";
import { AxiosError } from "axios";

export async function fetchGetCategories(
  token: string,
  query: IGetCategoriesQueryDto
) {
  try {
    const { data } = await customAxios.get(GET_CATEGORIES, null, token);
    return data;
  } catch (errorResponse: any) {
    console.error("errorResponse", errorResponse);
    const { code, message, response } = errorResponse;
    if (code === AxiosError.ERR_NETWORK) {
      return { code, message };
    }

    return errorResponse.response.data;
  }
}

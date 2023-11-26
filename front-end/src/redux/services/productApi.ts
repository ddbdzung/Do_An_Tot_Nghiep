import { ICreateProductBodyDto } from "@/api/product/dto/create-product.dto";
import { IGetProductQueryDto } from "@/api/product/dto/get-product.dto";
import {
  IGetProductsQueryDto,
  IProduct,
} from "@/api/product/dto/get-products.dto";
import {
  ADMIN_CREATE_PRODUCT,
  ADMIN_GET_PRODUCTS,
} from "@/api/product/endpoints";
import { customAxios } from "@/http-service/fetchAPI";
import { mapQueryToUrl } from "@/utils/mapQueryToUrl";
import { AxiosError } from "axios";

export async function fetchGetProduct(
  token: Tokens,
  query: IGetProductQueryDto
) {
  try {
    const url = `${ADMIN_GET_PRODUCTS}/${query.id}`;

    const { data } = await customAxios.get(url, null, token);
    return data as IResponsePayload<IProduct>;
  } catch (errorResponse: any) {
    const { code, message, response } = errorResponse;
    if (code === AxiosError.ERR_NETWORK) {
      return { code, message };
    }

    return errorResponse.response?.data;
  }
}

export async function fetchGetProducts(
  token: string,
  query: IGetProductsQueryDto
) {
  try {
    const url = mapQueryToUrl<IGetProductsQueryDto>(ADMIN_GET_PRODUCTS, query);
    const { data } = await customAxios.get(url, null, token);
    return data;
  } catch (errorResponse: any) {
    const { code, message, response } = errorResponse;
    if (code === AxiosError.ERR_NETWORK) {
      return { code, message };
    }

    return errorResponse.response.data;
  }
}

export async function fetchCreateProduct(
  token: string,
  payload: ICreateProductBodyDto
) {
  try {
    const { data } = await customAxios.post(
      ADMIN_CREATE_PRODUCT,
      payload,
      token
    );
    return data;
  } catch (errorResponse: any) {
    const { code, message, response } = errorResponse;
    if (code === AxiosError.ERR_NETWORK) {
      return { code, message };
    }

    return errorResponse.response.data;
  }
}

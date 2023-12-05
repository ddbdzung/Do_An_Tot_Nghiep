import { ICreateProductBodyDto } from "@/api/product/dto/create-product.dto";
import { IDeleteProductDto } from "@/api/product/dto/delete-product.dto";
import { IGetProductQueryDto } from "@/api/product/dto/get-product.dto";
import {
  IGetProductsQueryDto,
  IProduct,
} from "@/api/product/dto/get-products.dto";
import { ISearchProductsDto } from "@/api/product/dto/search-products.dto";
import {
  IUpdateProductBodyDto,
  IUpdateProductDto,
} from "@/api/product/dto/update-product.dto";
import {
  ADMIN_CREATE_PRODUCT,
  ADMIN_DELETE_PRODUCT,
  ADMIN_GET_PRODUCTS,
  ADMIN_UPDATE_PRODUCT,
  SEARCH_PRODUCTS,
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
    return data;
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

export async function fetchSearchProducts(
  token: string,
  query: ISearchProductsDto
) {
  try {
    const { data } = await customAxios.get(SEARCH_PRODUCTS(query), null, token);
    return data;
  } catch (errorResponse: any) {
    console.log("errorResponse", errorResponse);
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

export async function fetchUpdateProduct(
  token: string,
  payload: IUpdateProductDto
) {
  const { body, id } = payload;
  try {
    const { data } = await customAxios.patch(
      ADMIN_UPDATE_PRODUCT(id),
      body,
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

export async function fetchDeleteProduct(
  token: string,
  payload: IDeleteProductDto
) {
  const { id } = payload;
  try {
    const { data } = await customAxios.delete(
      ADMIN_DELETE_PRODUCT(id),
      null,
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

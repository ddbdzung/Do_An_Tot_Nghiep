import { IAddToCartBodyDto } from "@/api/cart/dto/IAddToCart.dto";
import {
  ADD_TO_CART,
  GET_CART,
  REMOVE_PRODUCT_FROM_CART,
} from "@/api/cart/endpoint";
import { customAxios } from "@/http-service/fetchAPI";
import { AxiosError } from "axios";

export async function fetchAddToCart(tokens: any, payload: IAddToCartBodyDto) {
  try {
    const { data } = await customAxios.patch(ADD_TO_CART, payload, tokens);
    return data;
  } catch (errorResponse: any) {
    const { code, message, response } = errorResponse;
    if (code === AxiosError.ERR_NETWORK) {
      return { code, message };
    }

    return errorResponse.response.data;
  }
}

export async function fetchGetCart(tokens: any, id: string) {
  try {
    const { data } = await customAxios.get(GET_CART(id), null, tokens);
    return data;
  } catch (errorResponse: any) {
    const { code, message, response } = errorResponse;
    if (code === AxiosError.ERR_NETWORK) {
      return { code, message };
    }

    return errorResponse.response.data;
  }
}

export async function fetchRemoveProductFromCart(
  tokens: any,
  productId: string
) {
  try {
    const { data } = await customAxios.delete(
      REMOVE_PRODUCT_FROM_CART(productId),
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
}

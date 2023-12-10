import { ICreateCategoryBodyDto } from "@/api/category/dto/create-category.dto";
import { IDeleteCategoryQueryDto } from "@/api/category/dto/delete-category.dto";
import { IGetCategoriesQueryDto } from "@/api/category/dto/get-categories.dto";
import { IGetCategoryQueryDto } from "@/api/category/dto/get-category.dto";
import { IUpdateCategoryDto } from "@/api/category/dto/update-category.dto";
import {
  CREATE_CATEGORY,
  DELETE_CATEGORY,
  GET_CATEGORIES,
  GET_CATEGORY,
  UPDATE_CATEGORY,
} from "@/api/category/endpoints";
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
    const { code, message, response } = errorResponse;
    if (code === AxiosError.ERR_NETWORK) {
      return { code, message };
    }

    return errorResponse.response.data;
  }
}

export async function fetchCreateCategory(
  token: string,
  payload: ICreateCategoryBodyDto
) {
  try {
    const { data } = await customAxios.post(CREATE_CATEGORY, payload, token);
    return data;
  } catch (errorResponse: any) {
    const { code, message, response } = errorResponse;
    if (code === AxiosError.ERR_NETWORK) {
      return { code, message };
    }

    return errorResponse.response.data;
  }
}

export async function fetchGetCategory(
  token: string,
  payload: IGetCategoryQueryDto
) {
  try {
    const { data } = await customAxios.get(GET_CATEGORY(payload), null, token);
    return data;
  } catch (errorResponse: any) {
    const { code, message, response } = errorResponse;
    if (code === AxiosError.ERR_NETWORK) {
      return { code, message };
    }

    return errorResponse.response.data;
  }
}

export async function fetchUpdateCategory(
  token: string,
  payload: IUpdateCategoryDto
) {
  try {
    const { data } = await customAxios.patch(
      UPDATE_CATEGORY(payload.query),
      payload.body,
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

export async function fetchDeleteCategory(
  token: string,
  payload: IDeleteCategoryQueryDto
) {
  try {
    const { data } = await customAxios.delete(
      DELETE_CATEGORY(payload),
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

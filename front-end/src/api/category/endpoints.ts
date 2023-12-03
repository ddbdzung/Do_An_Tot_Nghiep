import { IGetCategoryQueryDto } from "./dto/get-category.dto";
import { IUpdateCategoryQueryDto } from "./dto/update-category.dto";

export const GET_CATEGORIES = "/v1/categories/a";
export const CREATE_CATEGORY = "/v1/categories/a";
export const GET_CATEGORY = (val: IGetCategoryQueryDto) =>
  `/v1/categories/a/${val.id}`;
export const UPDATE_CATEGORY = (val: IUpdateCategoryQueryDto) =>
  `/v1/categories/a/${val.id}`;
export const DELETE_CATEGORY = (val: IGetCategoryQueryDto) =>
  `/v1/categories/a/${val.id}`;

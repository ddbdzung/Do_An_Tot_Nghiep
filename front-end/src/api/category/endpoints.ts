import { IGetCategoriesQueryDto } from "./dto/get-categories.dto";
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
export const GET_CATEGORIES_WITH_METADATA = (
  val: IGetCategoriesQueryDto = {}
) => {
  const { limit, page, search, sort, order } = val;
  let url = `/v1/categories/with-meta?`;
  if (limit) {
    url += `limit=${limit}&`;
  }
  if (page) {
    url += `page=${page}&`;
  }
  if (search) {
    url += `search=${search}&`;
  }
  if (sort) {
    url += `sort=${sort}&`;
  }
  if (order) {
    url += `order=${order}&`;
  }
  return url;
};

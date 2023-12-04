import { IGetProductsQueryDto } from "./dto/get-products.dto";

export const ADMIN_GET_PRODUCTS = "/v1/products/a";
export const ADMIN_CREATE_PRODUCT = "/v1/products/a";
export const ADMIN_UPDATE_PRODUCT = (productId) =>
  `/v1/products/a/${productId}`;
export const ADMIN_DELETE_PRODUCT = (productId) =>
  `/v1/products/a/${productId}`;
export const ADMIN_GET_PRODUCT = "/v1/products/a";
export const GET_PRODUCTS = (query: IGetProductsQueryDto) => {
  const { limit, page, search, category, sort, order } = query;
  let url = `/v1/products?`;
  if (limit) {
    url += `limit=${limit}&`;
  }
  if (page) {
    url += `page=${page}&`;
  }
  if (search) {
    url += `search=${search}&`;
  }
  if (category) {
    url += `category=${category}&`;
  }
  if (sort) {
    url += `sort=${sort}&`;
  }
  if (order) {
    url += `order=${order}&`;
  }
  return url;
};

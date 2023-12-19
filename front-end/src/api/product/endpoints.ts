import { IGetProductsQueryDto } from "./dto/get-products.dto";
import { ISearchProductsDto } from "./dto/search-products.dto";

export const ADMIN_GET_PRODUCTS = "/v1/products/a";

export const ADMIN_CREATE_PRODUCT = "/v1/products/a";

export const ADMIN_UPDATE_PRODUCT = (productId) =>
  `/v1/products/a/${productId}`;

export const ADMIN_DELETE_PRODUCT = (productId) =>
  `/v1/products/a/${productId}`;

export const ADMIN_GET_PRODUCT = "/v1/products/a";

export const GET_PRODUCTS = (query: IGetProductsQueryDto) => {
  const { limit, page, search, category, sort, order, ids } = query;
  let url = `/v1/products?`;
  if (Array.isArray(ids)) {
    url += `ids=${JSON.stringify(ids)}&`;
  }

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

export const GET_PRODUCT = (productId) => `/v1/products/${productId}`;

export const SEARCH_PRODUCTS = (query: ISearchProductsDto = {}) => {
  const { limit, page, name, categoryIds, sort, price } = query;
  let url = `/v1/products/search?`;
  if (limit) {
    url += `limit=${limit}&`;
  }
  if (page) {
    url += `page=${page}&`;
  }
  if (name) {
    url += `name=${name}&`;
  }
  if (categoryIds && Array.isArray(categoryIds)) {
    url += `categoryIds=${JSON.stringify(categoryIds)}&`;
  }
  if (sort) {
    url += `sort=${sort}&`;
  }
  if (price) {
    url += `price=${JSON.stringify(price)}&`;
  }

  if (url.endsWith("&")) {
    url = url.slice(0, -1);
  }
  return url;
};

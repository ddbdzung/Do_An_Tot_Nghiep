export const GET_ME = "/v1/users/me";

export const UPDATE_ME = "/v1/users/me";

export const GET_FAVORITE_PRODUCTS = "/v1/users/me/favourite-items";

export const TOGGLE_FAVORITE_PRODUCT = (id: string) =>
  `/v1/users/me/favourite-items/${id}/toggle`;

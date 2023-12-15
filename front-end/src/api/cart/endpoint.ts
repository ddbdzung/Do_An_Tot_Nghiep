export const ADD_TO_CART = "/v1/carts/add-to-cart";
export const GET_CART = (id: string) => `/v1/carts/${id}`;
export const REMOVE_PRODUCT_FROM_CART = (productId: string) =>
  `/v1/carts/item/${productId}`;

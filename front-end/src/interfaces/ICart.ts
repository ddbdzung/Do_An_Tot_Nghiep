import { IProduct } from "@/api/product/dto/get-products.dto";

export interface ICart {
  id: string;
  items: ICartItem[];
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface ICartItemNotRedux {
  product: IProduct;
  amount: number;
  updatedAt: string;
  _id: string;
}

export interface IGuestCart {
  items: IGuestCartItem[];
}

export interface IGuestCartItem {
  product: IProduct;
  amount: number;
}

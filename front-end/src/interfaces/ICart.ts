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

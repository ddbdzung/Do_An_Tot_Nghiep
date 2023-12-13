export interface ICart {
  id: string;
  items: ICartItem[];
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

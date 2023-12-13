import { ICart } from "@/interfaces/ICart";

export interface IAddToCartBodyDto {
  productId: string;
  quantity: number;
}

export interface IAddToCartResponseDto {
  user: string;
  products: [
    {
      product: string;
      amount: number;
      updatedAt: string;
    }
  ];
  id: string;
}

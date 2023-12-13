export interface IGetCartResponseDto {
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

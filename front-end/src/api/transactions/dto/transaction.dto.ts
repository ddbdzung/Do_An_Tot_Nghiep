import { Expose, Type } from "class-transformer";

export interface ITransaction {
  id: string;
  customerInfo: {
    name: string;
    phoneNumber: string;
    address: string;
  };
  customer: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  hasProgress: boolean;
  paymentMethod: string;
  products: [
    {
      productDetail: {
        name: string;
        price: number;
        image: string;
      };
      product: string;
      amount: number;
      price: number;
    }
  ];
}

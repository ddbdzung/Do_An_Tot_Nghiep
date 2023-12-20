import { PaymentMethod } from "@/redux/features/checkoutSlice";

export interface ITransactionOrderItem {
  productId: string;
  quantity: number;
}
export interface ICreateTransactionDto {
  order: ITransactionOrderItem[];
  paymentMethod: PaymentMethod;
  extraCustomerInfo: {
    address: string;
    phoneNumber: string;
  };
}

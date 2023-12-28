import { IUser } from "@/api/auth/dto/sign-up.dto";
import { ITransaction } from "@/api/transactions/dto/transaction.dto";

export interface Worker {
  id: string;
  name: string;
  responsibility: string;
  age: number;
  phoneNumber: string;
}

export interface IProgress {
  id: string;
  transaction: ITransaction;
  workers: Worker[];
  status: string;
  customer: IUser;
  createdAt: string;
  updatedAt: string;
  note: string;
  schedule: string;
}

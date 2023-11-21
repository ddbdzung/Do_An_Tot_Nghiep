import { IResponsePayload } from "@/http-service/response-handler";

export interface ISignUpBodyDto {
  email: string;
  password: string;
  name: string;
  address?: string;
  gender?: string;
  dateOfBirth?: string;
}

export interface IUser {
  isPasswordChange: boolean;
  status: string;
  name: string;
  email: string;
  gender: string;
  permissions: string;
  id: string;
}

export interface ISignUpResponseDto {
  user: IUser;
  tokens: Tokens;
}

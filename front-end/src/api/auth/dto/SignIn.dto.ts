import { IUser } from "./SignUp.dto";

export interface ISignInBodyDto {
  email: string;
  password: string;
}

export interface ISignInResponseDto {
  user: IUser;
  tokens: Tokens;
}

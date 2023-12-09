export interface IUpdateMeBodyDto {
  name?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
}

export interface IUpdateMeResponseDto {
  id: string;
  email: string;
  name: string;
  dateOfBirth?: string;
  address?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
  roleId: string;
  gender?: string;
  favouriteProducts: string[];
}

export interface IGetMeResponseDto {
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

export interface ICreateProductBodyDto {
  name: string;
  price: number;
  brand: string;
  categoryId: string;
  unit: string;
  quantity: number;
  image?: string;
  description?: string;
}

export interface ISearchProductsDto {
  limit?: number;
  page?: number;
  name?: string;
  categoryIds?: [string];
  sort?: string;
  price?: {
    min?: number;
    max?: number;
  };
}

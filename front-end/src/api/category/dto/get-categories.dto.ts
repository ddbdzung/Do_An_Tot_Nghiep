import { ICategory } from "./category.dto";

export interface IGetCategoriesQueryDto {
  limit?: number;
  page?: number;
  search?: string;
  sort?: string;
  order?: string;
}

export interface IGetCategoriesResponseDto {
  results: ICategory[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

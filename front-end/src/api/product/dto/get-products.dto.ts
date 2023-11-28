export interface IGetProductsQueryDto {
  limit?: number;
  page?: number;
  search?: string;
  category?: string;
  sort?: string;
  order?: string;
}

export interface IGetProductsResponseDto {
  results: IProduct[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface IProduct {
  id: number;
  name: string;
  price: {
    lastValue: number;
    history: [
      {
        _id: string;
        value: number;
        createdAt: string;
      }
    ];
  };
  brand: string;
  unit: string;
  category: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  image?:
    | [
        {
          url: string;
          pos: number;
          alt?: string;
        }
      ]
    | [];
  quantity: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

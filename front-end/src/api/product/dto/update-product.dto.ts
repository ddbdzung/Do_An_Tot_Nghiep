export interface IUpdateProductBodyDto {
  name?: string;
  price?: number;
  brand?: string;
  categoryId?: string;
  unit?: string;
  quantity?: number;
  image?: string;
  description?: string;
}

export interface IUpdateProductDto {
  id: string;
  body: IUpdateProductBodyDto;
}

export interface IUpdateProductResponseDto {
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
  deletedAt: string | null;
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

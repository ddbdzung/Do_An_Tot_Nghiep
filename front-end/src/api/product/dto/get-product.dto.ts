export interface IGetProductQueryDto {
  id: number;
}

export interface IGetProductResponseDto {
  id: number;
  name: string;
  price: {
    lastValue: number;
    history: [
      {
        value: number;
        createdAt: Date;
        _id: string;
      }
    ];
  };
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  brand: string;
  unit: string;
  quantity: number;
  images: [
    {
      _id: string;
      url: string;
      pos: number;
    }
  ];
  category: {
    name: string;
    id: string;
  };
}

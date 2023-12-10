export interface IGetFavoriteProductsQueryDto {
  productIds: string[];
}

export interface IGetFavoriteProductsResponseDto {
  results: IProduct[];
}

export interface IUpdateCategoryQueryDto {
  id: string;
}

export interface IUpdateCategoryBodyDto {
  name: string;
}

export interface IUpdateCategoryDto {
  query: IUpdateCategoryQueryDto;
  body: IUpdateCategoryBodyDto;
}

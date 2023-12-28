export interface IUpdateProgressDto {
  params: IUpdateProgressParamsDto;
  body: IUpdateProgressBodyDto;
}

export interface IUpdateProgressParamsDto {
  id: string;
}

export interface IUpdateProgressBodyDto {
  status: string;
  note: string;
  schedule: Date;
  workers: string[];
}

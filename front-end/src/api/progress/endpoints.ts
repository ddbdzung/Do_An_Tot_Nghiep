export const GET_PROGRESSES = (val: IGetProgressesQueryDto) => {
  const { limit, page, transactionId, status } = val;
  let url = `/v1/progresses?`;
  if (limit) {
    url += `limit=${limit}&`;
  }
  if (page) {
    url += `page=${page}&`;
  }
  if (transactionId) {
    url += `transactionId=${transactionId}&`;
  }
  if (status) {
    url += `status=${status}&`;
  }
  return url;
};

export const UPDATE_PROGRESS = (val: IUpdateProgressParamsDto) => {
  const { id } = val;
  return `/v1/progresses/${id}`;
};

export const GET_PROGRESS = (val: { id: string }) => {
  const { id } = val;
  return `/v1/progresses/${id}`;
};

export const mapQueryToUrl = <T>(url: string, query: T) => {
  const { page, limit, search, category } = query;
  let urlWithQuery = url;
  if (page) {
    urlWithQuery += `?page=${page}`;
  }
  if (limit) {
    urlWithQuery += `&limit=${limit}`;
  }
  if (search) {
    urlWithQuery += `&search=${search}`;
  }
  if (category) {
    urlWithQuery += `&category=${category}`;
  }
  return urlWithQuery;
};

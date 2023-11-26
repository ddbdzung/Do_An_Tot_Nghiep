// Fetch API without interceptor to refresh token
import { EnvironmentVariables } from "@/configurations/EnvironmentVariable";
import axios from "axios";

export enum HTTPMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}
const configHeaderRequest = (tokens: any) => {
  try {
    // if (!tokens?.access || !tokens?.refresh) {
    if (!tokens?.access) {
      return {};
    }
    return {
      Authorization: `Bearer ${tokens?.access}`,
    };
  } catch (e) {
    console.error("config header request error");
    return {};
  }
};

const request =
  (method: HTTPMethod) =>
  async (
    api: string,
    data: null | { [key: string]: any },
    tokens: any = {},
    _headers = null
  ) => {
    const headers = _headers || configHeaderRequest(tokens);
    const url = `${EnvironmentVariables.get(
      "backend.baseUrl"
    )}${EnvironmentVariables.get("backend.prefixEntryPoint")}${api}`;
    const body: { [name: string]: any } = {
      url,
      method,
    };
    if (data !== null) {
      body.data = data;
    }
    if (Object.keys(headers).length > 0) {
      /* @ts-nocheck */
      body.headers = headers;
    }

    return axios(body);
  };

export const customAxios = {
  get: request(HTTPMethod.GET),
  post: request(HTTPMethod.POST),
  put: request(HTTPMethod.PUT),
  patch: request(HTTPMethod.PATCH),
  delete: request(HTTPMethod.DELETE),
};

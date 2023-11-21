import { notifyError, notifySuccess } from "@/utils/notify";

export interface IResponsePayload<T> {
  code: any;
  message: string;
  data: T | null;
}

export function handleResponsePayload<T>(response: IResponsePayload<T>) {
  const { code, message, data } = response;
  if (code >= 200 && code < 300) {
    notifySuccess(message);
    return {
      metadata: {
        code,
        message,
      },
      data,
    };
  }

  if (code >= 400 && code < 500) {
    notifyError(message);
    return null;
  }

  return null;
}

import { notifyError, notifySuccess } from "@/utils/notify";

export interface IResponsePayload<T> {
  statusCode: any;
  message: string;
  data: T | null;
}

export function handleResponsePayload<T>(response: IResponsePayload<T>) {
  const { statusCode, message, data } = response;
  if (statusCode >= 200 && statusCode < 300) {
    notifySuccess(message);
    return {
      metadata: {
        statusCode,
        message,
      },
      data,
    };
  }

  if (statusCode >= 400 && statusCode < 500) {
    notifyError(message);
    return null;
  }

  return null;
}

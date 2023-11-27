import { notifyError, notifySuccess } from "@/utils/notify";

export interface IResponsePayload<T> {
  statusCode: any;
  message: string;
  data: T | null;
}

const assureOptionalObjectParams = (
  actualParams: { [key: string]: any },
  defaultParams: { [key: string]: any }
) => {
  const result = { ...defaultParams };
  for (const key in actualParams) {
    if (Object.prototype.hasOwnProperty.call(actualParams, key)) {
      result[key] = actualParams[key];
    }
  }
  return result;
};

export function handleResponsePayload<T>(
  response: IResponsePayload<T>,
  options = {
    notifySuccessMessage: true,
    successMessage: "",
    notifyErrorMessage: true,
    errorMessage: "",
  }
) {
  const defaultOptions = {
    notifySuccessMessage: true,
    successMessage: "",
    notifyErrorMessage: true,
    errorMessage: "",
  };
  options = assureOptionalObjectParams(options, defaultOptions);

  const { statusCode, message, data } = response;
  if (statusCode >= 200 && statusCode < 300) {
    if (options.notifySuccessMessage) {
      notifySuccess(options.successMessage || message);
    }
    return {
      metadata: {
        statusCode,
        message,
      },
      data,
    };
  }

  if (statusCode >= 400 && statusCode < 500) {
    if (options.notifyErrorMessage) {
      notifyError(options.errorMessage || message);
    }
    return null;
  }

  return null;
}

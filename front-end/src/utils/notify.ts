import toast from "react-hot-toast";

export const notifyError = (
  message: string,
  options = {
    duration: 1000,
  }
) => {
  toast.error(message, {
    position: "top-right",
    duration: options.duration,
  });
};

export const notifySuccess = (
  message: string,
  options = {
    duration: 1000,
  }
) => {
  toast.success(message, {
    position: "top-right",
    duration: options.duration,
  });
};

export const notifyPromise = (
  promise: Promise<any>,
  {
    successMessage,
    errorMessage,
    loadingMessage = "Loading...",
  }: {
    successMessage: string;
    errorMessage: string;
    loadingMessage?: string;
  }
) => {
  toast.promise(promise, {
    loading: loadingMessage,
    success: (data) => {
      return successMessage;
    },
    error: (err) => {
      return errorMessage;
    },
  });
};

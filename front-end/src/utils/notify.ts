import toast from "react-hot-toast";

export const notifyError = (message: string) => {
  toast.error(message, {
    position: "top-right",
    duration: 1000,
  });
};

export const notifySuccess = (message: string) => {
  toast.success(message, {
    position: "top-right",
    duration: 1000,
  });
};

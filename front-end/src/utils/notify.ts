import toast from "react-hot-toast";

export const notifyError = (message: string) => {
  toast.error(message, {
    position: "top-right",
    duration: 2500,
  });
};

export const notifySuccess = (message: string) => {
  toast.success(message, {
    position: "top-right",
    duration: 3000,
  });
};

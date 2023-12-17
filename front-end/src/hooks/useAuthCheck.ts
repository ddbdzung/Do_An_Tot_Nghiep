import { useAppSelector } from "@/redux/hooks";

const useAuthCheck = () => {
  const { accessToken } = useAppSelector((state) => state.authReducer);

  return !!accessToken;
};

export default useAuthCheck;

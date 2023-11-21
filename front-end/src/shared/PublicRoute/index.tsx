"use client";
import Page404 from "@/app/(landing-page)/not-found";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const withoutAuth = (Component: any) => {
  const AuthenticatedComponent = () => {
    const router = useRouter();
    const [auth, setAuth] = useState<boolean | undefined>();
    const { accessToken, permissions } = useAppSelector(
      (store) => store.authReducer
    );

    useEffect(() => {
      // If already logged in
      if (accessToken || permissions.length > 0) {
        router.push("/");
      } else {
        setAuth(false);
      }
    }, []);

    return !!auth ? <></> : <Component />; // Render whatever you want while the authentication occurs
  };

  return AuthenticatedComponent;
};

export default withoutAuth;

"use client";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const withAuth =
  ({ requiredRights = [] }: { requiredRights: string[] }) =>
  (Component: React.ReactNode) => {
    const AuthenticatedComponent = () => {
      const router = useRouter();
      const [auth, setAuth] = useState<boolean | undefined>();
      const { accessToken, permissions } = useAppSelector(
        (store) => store.authReducer
      );

      useEffect(() => {
        if (
          accessToken &&
          permissions.length > 0 &&
          requiredRights.every((right) => permissions.includes(right))
        ) {
          setAuth(true);
        } else {
          router.push("/signin ");
        }
      }, []);

      return !!auth ? <Component /> : <></>; // Render whatever you want while the authentication occurs
    };

    return AuthenticatedComponent;
  };

export default withAuth;

"use client";

import React, { FC, useEffect } from "react";
import facebookSvg from "@/images/Facebook.svg";
import twitterSvg from "@/images/Twitter.svg";
import googleSvg from "@/images/Google.svg";
import Input from "@/shared/Input/Input";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Image from "next/image";
import Link from "next/link";
import * as Yup from "yup";
import withoutAuth from "@/shared/PublicRoute";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { ISignInBodyDto } from "@/api/auth/dto/sign-in.dto";
import { AuthFormStatus, signInAsync } from "@/redux/features/authSlice";
import { throttle } from "lodash";
import { getCartAsync } from "@/redux/features/cartSlice";
import { getMeAsync } from "@/redux/features/userSlice";

const loginSocials = [
  {
    name: "Tiếp tục với Facebook",
    href: "#",
    icon: facebookSvg,
  },
  {
    name: "Tiếp tục với Twitter",
    href: "#",
    icon: twitterSvg,
  },
  {
    name: "Tiếp tục với Google",
    href: "#",
    icon: googleSvg,
  },
];

const throttleSubmit = throttle(
  async function (
    values: any,
    actions: FormikHelpers<any>,
    dispatch: (...arg: any) => any
  ) {
    const payload: ISignInBodyDto = {
      email: values.email,
      password: values.password,
    };
    dispatch(signInAsync(payload)).then((result) => {
      if (!result?.meta?.requestStatus === "fulfilled") return;

      const uid = result?.payload.data?.user?._id;
      if (result?.payload?.statusCode === 200) {
        dispatch(getMeAsync());
        dispatch(getCartAsync(uid));
      }
    });
  },
  1000,
  { trailing: false }
);

const PageLogin = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { formStatus, accessToken } = useAppSelector(
    (state) => state.authReducer
  );
  useEffect(() => {
    if (accessToken) {
      router.push("/");
    }
  }, [accessToken, router]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: (values, actions) => {
      throttleSubmit(values, actions, dispatch);
    },
  });

  return (
    <div className={`nc-PageLogin`} data-nc-id="PageLogin">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Đăng Nhập
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          <div className="grid gap-3">
            {loginSocials.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
              >
                <Image
                  className="flex-shrink-0"
                  src={item.icon}
                  alt={item.name}
                  sizes="40px"
                />
                <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                  {item.name}
                </h3>
              </a>
            ))}
          </div>
          {/* OR */}
          <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
              Hoặc
            </span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div>
          {/* FORM */}
          <form
            onSubmit={formik.handleSubmit}
            className="grid grid-cols-1 gap-6"
          >
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Địa chỉ Email
              </span>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="example@example.com"
                className="mt-1"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              {formik.errors.email && (
                <span className="text-xs text-red-500">
                  {formik.errors.email}
                </span>
              )}
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Mật khẩu
                <Link href="/forgot-pass" className="text-sm text-green-600">
                  Quên mật khẩu?
                </Link>
              </span>
              <Input
                type="password"
                className="mt-1"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              {formik.errors.password && (
                <span className="text-xs text-red-500">
                  {formik.errors.password}
                </span>
              )}
            </label>
            {formStatus && formStatus === AuthFormStatus.IDLE ? (
              <ButtonPrimary type="submit">Tiếp tục</ButtonPrimary>
            ) : (
              <ButtonPrimary type="submit">
                <span className="mx-2">Đang tải</span>
                <svg
                  role="status"
                  className="inline mr-3 w-4 h-4 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
              </ButtonPrimary>
            )}
          </form>

          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Người dùng mới? {` `}
            <Link className="text-green-600" href="/signup">
              Tạo tài khoản
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default withoutAuth(PageLogin);

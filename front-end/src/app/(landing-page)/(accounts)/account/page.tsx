"use client";

import Label from "@/components/Label/Label";
import React, { FC, useEffect } from "react";
import * as Yup from "yup";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import Select from "@/shared/Select/Select";
import Textarea from "@/shared/Textarea/Textarea";
import { avatarImgs } from "@/contains/fakeData";
import Image from "next/image";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getMeAsync, updateMeAsync } from "@/redux/features/userSlice";
import { getChangedValues } from "@/utils/getChangesObject";
import { throttle } from "lodash";
import { IUpdateMeBodyDto } from "@/api/user/dto/update-me.dto";
import { notifyError } from "@/utils/notify";
import { updateFullname } from "@/redux/features/authSlice";

const throttleUpdate = throttle(
  async function (
    values: IUpdateMeBodyDto,
    actions: FormikHelpers<any>,
    dispatch: (...arg: any) => any
  ) {
    dispatch(updateMeAsync(values)).then((res) => {
      if (updateMeAsync.fulfilled.match(res)) {
        dispatch(updateFullname(res.payload?.data?.name));
      }
      actions.setSubmitting(false);
    });
  },
  1000,
  { trailing: false }
);

const AccountPage = () => {
  const dispatch = useAppDispatch();
  const userStates = useAppSelector((state) => state.userReducer);
  const authStates = useAppSelector((state) => state.authReducer);

  useEffect(() => {
    let mounted = true;
    dispatch(getMeAsync());

    return () => {
      mounted = false;
    };
  }, []);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullname: authStates.fullname || "",
      dateOfBirth: userStates.dateOfBirth || "",
      address: userStates.address || "",
      gender: userStates.gender || "",
      phoneNumber: userStates.phoneNumber || "",
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required("Required"),
      address: Yup.string().trim(),
      gender: Yup.string().trim(),
      phoneNumber: Yup.string().trim(),
    }),
    onSubmit: (values, actions) => {
      const changedValues = getChangedValues(values, formik.initialValues);
      if (Object.keys(changedValues).length === 0) {
        notifyError("No changes to update");
        return;
      }
      throttleUpdate(changedValues, actions, dispatch);
    },
  });

  return (
    <div className={`nc-AccountPage `}>
      <div className="space-y-10 sm:space-y-12">
        {/* HEADING */}
        <h2 className="text-2xl sm:text-3xl font-semibold">
          Thông Tin Tài Khoản
        </h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col md:flex-row">
            <div className="flex-shrink-0 flex items-start">
              {/* AVATAR */}
              <div className="relative rounded-full overflow-hidden flex">
                <Image
                  src={avatarImgs[2]}
                  alt="avatar"
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full object-cover z-0"
                />
                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <span className="mt-1 text-xs">Thay ảnh</span>
                </div>
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
            <div className="flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-6">
              <div>
                <Label>Họ và tên</Label>
                <Input
                  className="mt-1.5"
                  id="fullname"
                  name="fullname"
                  value={formik.values.fullname}
                  onChange={formik.handleChange}
                />
              </div>

              {/* ---- */}

              {/* ---- */}
              <div>
                <Label>Email</Label>
                <div className="mt-1.5 flex">
                  <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                    <i className="text-2xl las la-envelope"></i>
                  </span>
                  <Input
                    className="!rounded-l-none"
                    disabled
                    id="email"
                    name="email"
                    defaultValue={authStates.email}
                  />
                </div>
              </div>

              {/* ---- */}
              <div className="max-w-lg">
                <Label>Ngày sinh</Label>
                <div className="mt-1.5 flex">
                  <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                    <i className="text-2xl las la-calendar"></i>
                  </span>
                  <Input
                    className="!rounded-l-none"
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formik.values.dateOfBirth}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>
              {/* ---- */}
              <div>
                <Label>Địa chỉ</Label>
                <div className="mt-1.5 flex">
                  <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                    <i className="text-2xl las la-map-signs"></i>
                  </span>
                  <Input
                    className="!rounded-l-none"
                    id="address"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>

              {/* ---- */}
              <div>
                <Label>Giới tính</Label>
                <Select
                  className="mt-1.5"
                  id="gender"
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  defaultChecked=""
                >
                  <option value="" disabled>
                    Chọn
                  </option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </Select>
              </div>

              {/* ---- */}
              <div>
                <Label>Số điện thoại</Label>
                <div className="mt-1.5 flex">
                  <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                    <i className="text-2xl las la-phone-volume"></i>
                  </span>
                  <Input
                    className="!rounded-l-none"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>
              {/* ---- */}
              <div>
                <Label>Về bạn</Label>
                <Textarea className="mt-1.5" defaultValue="..." />
              </div>
              <div className="pt-2">
                <ButtonPrimary type="submit">Cập nhật</ButtonPrimary>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountPage;

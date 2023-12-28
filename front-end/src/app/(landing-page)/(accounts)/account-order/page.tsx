"use client";

import Prices from "@/components/Prices";
import { PRODUCTS } from "@/data/data";
import { useAppSelector } from "@/redux/hooks";
import { fetchGetTransactionOfMe } from "@/redux/services/checkoutApi";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import { formatDateToLocale } from "@/utils/formatDate";
import { renderImageCloudinary } from "@/utils/renderImage";
import Image from "next/image";
import { useEffect, useState } from "react";

const AccountOrder = () => {
  const { accessToken } = useAppSelector((state) => state.authReducer);
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    let isMounted = false;
    if (!isMounted) {
      fetchGetTransactionOfMe({ access: accessToken || "" })
        .then((res) => {
          if (res?.statusCode === 200) {
            setTransactions(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    return () => {
      isMounted = true;
    };
  }, [accessToken]);

  const renderProductItem = (product: any, index: number) => {
    if (!product) return null;

    const { productDetail, amount } = product;
    return (
      <div key={index} className="flex py-4 sm:py-7 last:pb-0 first:pt-0">
        <div className="relative h-24 w-16 sm:w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image
            fill
            sizes="100px"
            src={renderImageCloudinary(productDetail?.image)}
            alt={productDetail?.name}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium line-clamp-1">
                  {productDetail?.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span>{"Natural"}</span>
                  <span className="mx-2 border-l border-slate-200 dark:border-slate-700 h-4"></span>
                </p>
              </div>
              <Prices className="mt-0.5 ml-2" />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400 flex items-center">
              <span className="hidden sm:inline-block">SL</span>
              <span className="inline-block sm:hidden">x</span>
              <span className="ml-2">{amount}</span>
            </p>

            <div className="flex">
              <button
                type="button"
                className="font-medium text-indigo-600 dark:text-primary-500 "
              >
                Nhận xét
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOrder = (transaction) => {
    const { paymentMethod, status, _id, createdAt, products } = transaction;
    return (
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden z-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-8 bg-slate-50 dark:bg-slate-500/5">
          <div>
            <p className="text-lg font-semibold">{_id}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
              <span>{formatDateToLocale(createdAt)}</span>
              <span className="mx-2">·</span>
              <span className="text-primary-500">{status}</span>
              <span className="mx-2">·</span>
              <span className="text-primary-500">{paymentMethod}</span>
            </p>
          </div>
          <div className="mt-3 sm:mt-0">
            <ButtonSecondary
              sizeClass="py-2.5 px-4 sm:px-6"
              fontSize="text-sm font-medium"
            >
              Xem đơn hàng
            </ButtonSecondary>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 p-2 sm:p-8 divide-y divide-y-slate-200 dark:divide-slate-700">
          {Array.isArray(products) && products.map(renderProductItem)}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* HEADING */}
      <h2 className="text-2xl sm:text-3xl font-semibold">Lịch sử mua hàng</h2>
      {Array.isArray(transactions) && transactions.map(renderOrder)}
    </div>
  );
};

export default AccountOrder;

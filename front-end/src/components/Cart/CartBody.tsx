"use client";

import { PRODUCTS } from "@/data/data";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Prices from "../Prices";
import NcInputNumber from "../NcInputNumber";
import Link from "next/link";
import Image from "next/image";
import { CheckIcon, NoSymbolIcon } from "@heroicons/react/24/solid";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addToCartAsync,
  getCartAsync,
  removeProductFromCartAsync,
} from "@/redux/features/cartSlice";
import { use, useCallback, useEffect, useState } from "react";
import { renderImageCloudinary } from "@/utils/renderImage";
import { IProduct } from "@/api/product/dto/get-products.dto";
import { ICart, ICartItem, ICartItemNotRedux } from "@/interfaces/ICart";
import { throttle } from "lodash";
import { notifyError, notifySuccess } from "@/utils/notify";
import formatVnCurrency from "@/utils/formatVnCurrency";

const SHIPPING_FEE = 20000;

export default function CartBody() {
  const { items } = useAppSelector((state) => state.cartReducer);
  const { uid } = useAppSelector((state) => state.authReducer);
  const [subTotal, setSubTotal] = useState(0);
  const dispatch = useAppDispatch();
  useEffect(() => {
    let mounted = false;
    if (!mounted) {
      dispatch(getCartAsync(uid));
    }

    return () => {
      mounted = true;
    };
  }, []);

  useEffect(() => {
    setSubTotal(calcSubTotal(items));
  }, [items]);

  const handleRemoveItem = (productId: string) => {
    dispatch(removeProductFromCartAsync(productId)).then((res) => {
      dispatch(getCartAsync(uid));
      notifySuccess("Remove item from cart successfully");
    });
  };

  const handleUpdateCart = throttle(
    async (amount, product) => {
      dispatch(
        addToCartAsync({
          productId: product.id,
          quantity: amount,
        })
      ).then((res) => {
        dispatch(getCartAsync(uid));
      });
    },
    2000,
    { trailing: false }
  );
  const renderStatusSoldout = () => {
    return (
      <div className="rounded-full flex items-center justify-center px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        <NoSymbolIcon className="w-3.5 h-3.5" />
        <span className="ml-1 leading-none">Sold Out</span>
      </div>
    );
  };

  const renderStatusInstock = () => {
    return (
      <div className="rounded-full flex items-center justify-center px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        <CheckIcon className="w-3.5 h-3.5" />
        <span className="ml-1 leading-none">In Stock</span>
      </div>
    );
  };
  const renderProduct = (item: ICartItemNotRedux, index: number) => {
    const { amount, product } = item;
    const { name, price, images, id: productId } = product as IProduct;

    return (
      <div
        key={index}
        className="relative flex py-8 sm:py-10 xl:py-12 first:pt-0 last:pb-0"
      >
        <div className="relative h-36 w-24 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image
            fill
            src={renderImageCloudinary(images?.at(0).url)}
            alt={name}
            sizes="300px"
            className="h-full w-full object-contain object-center"
          />
          <Link href="/product-detail" className="absolute inset-0"></Link>
        </div>

        <div className="ml-3 sm:ml-6 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div className="flex-[1.5] ">
                <h3 className="text-base font-semibold">
                  <Link href="/product-detail">{name}</Link>
                </h3>
                <div className="mt-1.5 sm:mt-2.5 flex text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center space-x-1.5">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M7.01 18.0001L3 13.9901C1.66 12.6501 1.66 11.32 3 9.98004L9.68 3.30005L17.03 10.6501C17.4 11.0201 17.4 11.6201 17.03 11.9901L11.01 18.0101C9.69 19.3301 8.35 19.3301 7.01 18.0001Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8.35 1.94995L9.69 3.28992"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.07 11.92L17.19 11.26"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 22H16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.85 15C18.85 15 17 17.01 17 18.24C17 19.26 17.83 20.09 18.85 20.09C19.87 20.09 20.7 19.26 20.7 18.24C20.7 17.01 18.85 15 18.85 15Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <span>{`Black`}</span>
                  </div>
                  <span className="mx-4 border-l border-slate-200 dark:border-slate-700 "></span>
                  <div className="flex items-center space-x-1.5">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 9V3H15"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 15V21H9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21 3L13.5 10.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.5 13.5L3 21"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <div className="mt-3 flex justify-between w-full sm:hidden relative">
                  <select
                    name="qty"
                    id="qty"
                    className="form-select text-sm rounded-md py-1 border-slate-200 dark:border-slate-700 relative z-10 dark:bg-slate-800 "
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                  </select>
                  <Prices
                    contentClass="py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium h-full"
                    price={price?.lastValue}
                  />
                </div>
              </div>

              <div className="hidden sm:block text-center relative">
                <NcInputNumber
                  defaultValue={amount}
                  className="relative z-10"
                  onChange={(newAmount) =>
                    handleUpdateCart(newAmount - amount, product)
                  }
                />
              </div>

              <div className="hidden flex-1 sm:flex justify-end">
                <Prices price={price?.lastValue} className="mt-0.5" />
              </div>
            </div>
          </div>

          <div className="flex mt-auto pt-4 items-end justify-between text-sm">
            {Math.random() > 0.6
              ? renderStatusSoldout()
              : renderStatusInstock()}

            <a className="relative z-10 flex items-center mt-3 font-medium text-primary-6000 hover:text-primary-500 text-sm ">
              <span>
                <button
                  onClick={(e) => handleRemoveItem(product.id)}
                  style={{ display: "inline" }}
                >
                  Remove
                </button>
              </span>
            </a>
          </div>
        </div>
      </div>
    );
  };
  const calcSubTotal = (items) =>
    Array.isArray(items) &&
    items.reduce(
      (acc, item) => acc + item.amount * item.product?.price?.lastValue,
      0
    );

  return Array.isArray(items) && items.length > 0 ? (
    <>
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-[60%] xl:w-[55%] divide-y divide-slate-200 dark:divide-slate-700 ">
          {Array.isArray(items) && items.map(renderProduct)}
        </div>
        <div className="border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 my-10 lg:my-0 lg:mx-10 xl:mx-16 2xl:mx-20 flex-shrink-0"></div>
        <div className="flex-1">
          <div className="sticky top-28">
            <h3 className="text-lg font-semibold ">Order Summary</h3>
            <div className="mt-7 text-sm text-slate-500 dark:text-slate-400 divide-y divide-slate-200/70 dark:divide-slate-700/80">
              <div className="flex justify-between pb-4">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  {formatVnCurrency(subTotal)}
                </span>
              </div>
              <div className="flex justify-between py-4">
                <span>Shpping estimate</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  {formatVnCurrency(SHIPPING_FEE)}
                </span>
              </div>
              <div className="flex justify-between py-4">
                <span>Tax estimate 8%</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  {formatVnCurrency(subTotal * 0.1)}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-slate-900 dark:text-slate-200 text-base pt-4">
                <span>Order total</span>
                <span>
                  {formatVnCurrency(subTotal + SHIPPING_FEE + subTotal * 0.1)}
                </span>
              </div>
            </div>
            <ButtonPrimary href="/checkout" className="mt-8 w-full">
              Checkout
            </ButtonPrimary>
            <div className="mt-5 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center">
              <p className="block relative pl-5">
                <svg
                  className="w-4 h-4 absolute -left-1 top-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 8V13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.9945 16H12.0035"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Learn more{` `}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="##"
                  className="text-slate-900 dark:text-slate-200 underline font-medium"
                >
                  Taxes
                </a>
                <span>
                  {` `}and{` `}
                </span>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="##"
                  className="text-slate-900 dark:text-slate-200 underline font-medium"
                >
                  Shipping
                </a>
                {` `} infomation
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <div className="text-center">
      <span className="text-lg">
        Cart is empty. Let{"'"}s look at some products{" "}
        <Link style={{ color: "blue" }} href="/collection">
          here
        </Link>
      </span>
    </div>
  );
}

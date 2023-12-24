"use client";

import Label from "@/components/Label/Label";
import NcInputNumber from "@/components/NcInputNumber";
import Prices from "@/components/Prices";
import { Product, PRODUCTS } from "@/data/data";
import { useEffect, useState } from "react";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import Input from "@/shared/Input/Input";
import ContactInfo from "./ContactInfo";
import PaymentMethod from "./PaymentMethod";
import ShippingAddress from "./ShippingAddress";
import Image from "next/image";
import Link from "next/link";
import { IProduct } from "@/api/product/dto/get-products.dto";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addToCartAsync,
  clearCart,
  getCartAsync,
  removeProductFromCartAsync,
} from "@/redux/features/cartSlice";
import dynamic from "next/dynamic";
import { ICartItem, ICartItemNotRedux } from "@/interfaces/ICart";
import { renderImageCloudinary } from "@/utils/renderImage";
import formatVnCurrency from "@/utils/formatVnCurrency";
import { throttle } from "lodash";
import { notifyError, notifySuccess } from "@/utils/notify";
import useAuthCheck from "@/hooks/useAuthCheck";
import { ICreateTransactionDto } from "@/api/checkout/dto/create-transaction.dto";
import {
  clearCheckout,
  createTransactionAsync,
} from "@/redux/features/checkoutSlice";
import { loadState } from "@/utils/localStorage";

const SHIPPING_FEE = 20000;
const CheckoutPage = () => {
  const { items } = useAppSelector((state) => state.cartReducer);
  const { uid } = useAppSelector((state) => state.authReducer);
  const { paymentMethod, phoneNumber, address } = useAppSelector(
    (state) => state.checkoutSlice
  );
  const [cart, setCart] = useState(items);
  const dispatch = useAppDispatch();
  const isAuth = useAuthCheck();
  useEffect(() => {
    let mounted = false;
    if (!mounted) {
      if (isAuth) {
        dispatch(getCartAsync(uid));
      }
    }

    return () => {
      mounted = true;
    };
  }, []);
  useEffect(() => {
    setSubTotal(calcSubTotal(items));
  }, [items]);
  const handleCheckout = () => {
    if (Array.isArray(cart) && cart?.length === 0) {
      notifyError("Your cart is empty");
      return;
    }
    if (phoneNumber === "") {
      if (phoneNumber !== loadState("phoneNumber")) {
      }
    }
    const payload: ICreateTransactionDto = {
      paymentMethod,
      order: cart.map((i) => ({
        productId: i?.product?.id,
        quantity: i?.amount,
      })),
      extraCustomerInfo: {
        phoneNumber:
          phoneNumber === "" && phoneNumber !== loadState("phoneNumber")
            ? loadState("phoneNumber")
            : phoneNumber,
        address,
      },
    };
    dispatch(createTransactionAsync(payload)).then((res) => {
      if (
        res?.meta?.requestStatus === "fulfilled" &&
        res?.payload?.statusCode === 201
      ) {
        dispatch(clearCart());
        dispatch(clearCheckout());
        setCart([]);
      }
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
  const handleRemoveItem = (productId: string) => {
    dispatch(removeProductFromCartAsync(productId)).then((res) => {
      dispatch(getCartAsync(uid));
      setCart(
        cart.filter((item) => {
          return item.id !== productId;
        })
      );
      notifySuccess("Remove item from cart successfully");
    });
  };
  const calcSubTotal = (items) =>
    Array.isArray(items) &&
    items.reduce(
      (acc, item) => acc + item.amount * item.product?.price?.lastValue,
      0
    );

  const [tabActive, setTabActive] = useState<
    "ContactInfo" | "ShippingAddress" | "PaymentMethod"
  >("ShippingAddress");

  const handleScrollToEl = (id: string) => {
    const element = document.getElementById(id);
    setTimeout(() => {
      element?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };
  const [subTotal, setSubTotal] = useState(0);

  const renderProduct = (item: ICartItemNotRedux, index: number) => {
    const { product, amount } = item;
    const { images, price, name } = product;

    return (
      <div key={index} className="relative flex py-7 first:pt-0 last:pb-0">
        <div className="relative h-36 w-24 sm:w-28 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={renderImageCloudinary(images?.at(0)?.url)}
            fill
            alt={name}
            className="h-full w-full object-contain object-center"
            sizes="150px"
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

              <div className="hidden flex-1 sm:flex justify-end">
                <Prices price={price?.lastValue} className="mt-0.5" />
              </div>
            </div>
          </div>

          <div className="flex mt-auto pt-4 items-end justify-between text-sm">
            <div className="hidden sm:block text-center relative">
              <NcInputNumber
                onChange={(newAmount) =>
                  handleUpdateCart(newAmount - amount, product)
                }
                defaultValue={amount}
                className="relative z-10"
              />
            </div>

            <a
              href="##"
              className="relative z-10 flex items-center mt-3 font-medium text-primary-6000 hover:text-primary-500 text-sm "
            >
              <span>
                <button
                  onClick={(e) => handleRemoveItem(product.id)}
                  style={{ display: "inline" }}
                >
                  Xóa
                </button>
              </span>
            </a>
          </div>
        </div>
      </div>
    );
  };

  const renderLeft = () => {
    return (
      <div className="space-y-8">
        <div id="ContactInfo" className="scroll-mt-24">
          <ContactInfo
            isActive={tabActive === "ContactInfo"}
            onOpenActive={() => {
              setTabActive("ContactInfo");
              handleScrollToEl("ContactInfo");
            }}
            onCloseActive={() => {
              setTabActive("ShippingAddress");
              handleScrollToEl("ShippingAddress");
            }}
          />
        </div>

        <div id="ShippingAddress" className="scroll-mt-24">
          <ShippingAddress
            isActive={tabActive === "ShippingAddress"}
            onOpenActive={() => {
              setTabActive("ShippingAddress");
              handleScrollToEl("ShippingAddress");
            }}
            onCloseActive={() => {
              setTabActive("PaymentMethod");
              handleScrollToEl("PaymentMethod");
            }}
          />
        </div>

        <div id="PaymentMethod" className="scroll-mt-24">
          <PaymentMethod
            isActive={tabActive === "PaymentMethod"}
            onOpenActive={() => {
              setTabActive("PaymentMethod");
              handleScrollToEl("PaymentMethod");
            }}
            onCloseActive={() => setTabActive("PaymentMethod")}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="nc-CheckoutPage">
      <main className="container py-16 lg:pb-28 lg:pt-20 ">
        <div className="mb-16">
          <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold ">
            Thanh toán
          </h2>
          <div className="block mt-3 sm:mt-5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-400">
            <Link href={"/"} className="">
              Trang chủ
            </Link>
            <span className="text-xs mx-1 sm:mx-1.5">/</span>
            <Link href={"/collection-2"} className="">
              Danh mục
            </Link>
            <span className="text-xs mx-1 sm:mx-1.5">/</span>
            <span className="underline">Thanh toán</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="flex-1">{renderLeft()}</div>

          <div className="flex-shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 my-10 lg:my-0 lg:mx-10 xl:lg:mx-14 2xl:mx-16 "></div>

          <div className="w-full lg:w-[36%] ">
            <h3 className="text-lg font-semibold">Đơn hàng của bạn</h3>
            <div className="mt-8 divide-y divide-slate-200/70 dark:divide-slate-700 ">
              {Array.isArray(cart) && cart?.map(renderProduct)}
            </div>

            <div className="mt-10 pt-6 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200/70 dark:border-slate-700 ">
              <div>
                <Label className="text-sm">Mã giảm giá</Label>
                <div className="flex mt-1.5">
                  <Input sizeClass="h-10 px-4 py-3" className="flex-1" />
                  <button className="text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 rounded-2xl px-4 ml-3 font-medium text-sm bg-neutral-200/70 dark:bg-neutral-700 dark:hover:bg-neutral-800 w-24 flex justify-center items-center transition-colors">
                    Áp dụng
                  </button>
                </div>
              </div>

              <div className="mt-4 flex justify-between py-2.5">
                <span>Tổng tiền hàng</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  {formatVnCurrency(subTotal)}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span>Phí vận chuyển</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  {formatVnCurrency(SHIPPING_FEE)}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span>Thuế VAT 8%</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  {formatVnCurrency(subTotal * 0.08)}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-slate-900 dark:text-slate-200 text-base pt-4">
                <span>Thành tiền</span>
                <span>
                  {formatVnCurrency(subTotal + SHIPPING_FEE + subTotal * 0.08)}
                </span>
              </div>
            </div>
            <ButtonPrimary onClick={handleCheckout} className="mt-8 w-full">
              Xác nhận thanh toán
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
                Tìm hiểu thêm về{` `}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="##"
                  className="text-slate-900 dark:text-slate-200 underline font-medium"
                >
                  Thuế
                </a>
                <span>
                  {` `}và{` `}
                </span>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="##"
                  className="text-slate-900 dark:text-slate-200 underline font-medium"
                >
                  Chi phí vận chuyển
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default dynamic(() => Promise.resolve(CheckoutPage), {
  ssr: false,
});

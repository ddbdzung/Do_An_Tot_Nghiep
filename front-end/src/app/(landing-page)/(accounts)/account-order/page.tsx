"use client";

import Prices from "@/components/Prices";
import { PRODUCTS } from "@/data/data";
import { customAxios } from "@/http-service/fetchAPI";
import { useAppSelector } from "@/redux/hooks";
import { fetchGetTransactionOfMe } from "@/redux/services/checkoutApi";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import { formatDateToLocale } from "@/utils/formatDate";
import formatVnCurrency from "@/utils/formatVnCurrency";
import { renderImageCloudinary } from "@/utils/renderImage";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export const PROGRESS_STATUS = {
  scheduling: "Đang lên lịch",
  on_going: "Đang di chuyển",
  in_progress: "Đang tiến hành",
  done: "Hoàn thành",
  cancel: "Đã hủy",
};

export const TRANSACTION_STATUS = {
  preparing: "Chờ xác nhận",
  delivering: "Đang giao hàng",
  cancel: "Đã hủy",
  done: "Hoàn thành",
  return: "Hoàn trả hàng",
};

export const TRANSACTION_PAYMENT_METHOD = {
  cod: "Thanh toán khi nhận hàng",
};

const getStatusPercentage = (status) => {
  switch (status) {
    case "scheduling":
      return 25;
    case "on_going":
      return 50;
    case "in_progress":
      return 75;
    case "done":
      return 100;
    case "cancel":
      return 0; // Bạn có thể chọn phần trăm tương ứng với trạng thái cancel
    default:
      return 0;
  }
};
// Hàm trả về class CSS tương ứng với màu sắc của thanh tiến trình
const getStatusColorClass = (status) => {
  switch (status) {
    case "scheduling":
      return "bg-blue-500";
    case "on_going":
      return "bg-yellow-500";
    case "in_progress":
      return "bg-green-500";
    case "done":
      return "bg-green-500";
    case "cancel":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

// Hàm trả về class CSS tương ứng với màu sắc của văn bản trong thanh tiến trình
const getStatusTextColorClass = (status) => {
  switch (status) {
    case "scheduling":
      return "text-blue-500";
    case "on_going":
      return "text-yellow-500";
    case "in_progress":
      return "text-green-500";
    case "done":
      return "text-green-500";
    case "cancel":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

// Hàm trả về class CSS tương ứng với vị trí và chiều dài của thanh tiến trình
const getStatusBarClass = (status) => {
  switch (status) {
    case "scheduling":
      return "flex h-2 w-[25%] relative bg-blue-200 rounded-full";
    case "on_going":
      return "flex h-2 w-[50%] bg-yellow-200 rounded-full";
    case "in_progress":
      return "flex h-2 w-[75%] relative bg-green-200 rounded-full";
    case "done":
      return "flex h-2 w-[100%] relative bg-green-200 rounded-full";
    case "cancel":
      return "flex h-2 w-[1%] relative bg-red-200 rounded-full";
    default:
      return "flex h-2 relative bg-gray-200 rounded-full";
  }
};

// Hàm trả về class CSS tương ứng với chiều dài của thanh tiến trình
const getProgressScore = (status) => {
  switch (status) {
    case "scheduling":
      return 25;
    case "on_going":
      return 50;
    case "in_progress":
      return 75;
    case "done":
      return 100;
    case "cancel":
      return 0;
    default:
      return 0;
  }
};

const getStatusFillClass = (status) => {
  const progressScore = getProgressScore(status);

  // Ánh xạ điểm số thành chiều dài
  const width = `${progressScore}%`;

  return `w-[${width}px]`;
};

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="w-full h-full">
      <div className="fixed inset-0 z-50 flex items-center justify-center w-full">
        <div className="fixed inset-0 bg-black opacity-50 "></div>
        <div className="relative z-50 bg-white p-8 rounded-lg max-w-lg w-full">
          <span
            className="absolute top-0 right-0 m-4 text-xl cursor-pointer"
            onClick={onClose}
          >
            &times;
          </span>
          <h2 className="text-2xl font-semibold mb-4">Thông tin đơn hàng</h2>
          <hr />
          <p className="my-2">ID Đơn Hàng: {order.transaction.id}</p>
          <p className="mb-2">
            Số Điện Thoại: {order.transaction.customerInfo.phoneNumber}
          </p>
          <p className="mb-2">
            Địa Chỉ: {order.transaction.customerInfo.address}
          </p>
          <p className="mb-2">
            Trạng Thái: {TRANSACTION_STATUS[order.transaction.status]}
          </p>
          <p className="mb-2">
            Phương Thức Thanh Toán: {order.transaction.paymentMethod}
          </p>
          <p className="mb-2">
            Giá trị đơn hàng: {formatVnCurrency(order.transaction?.totalPrice)}
          </p>
          <p className="mb-2">
            Ngày Tạo Đơn: {formatDateToLocale(order.transaction.createdAt)}
          </p>
          <p className="mb-2">
            Cập Nhật Gần Nhất: {formatDateToLocale(order.transaction.updatedAt)}
          </p>

          <h3 className="text-lg font-semibold mt-6">Chi Tiết Tiến Độ</h3>

          {order.progresses.map((progress, index) => (
            <div key={index} className="mb-4 border-t pt-4">
              <p className="text-lg font-semibold">Bước {index + 1}</p>
              <p>Trạng thái: {PROGRESS_STATUS[progress.status]}</p>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div className="flex-1 flex items-center">
                    <div
                      className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${getStatusColorClass(
                        progress.status
                      )}`}
                    >
                      {progress.status}
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xs font-semibold inline-block ${getStatusTextColorClass(
                        progress.status
                      )}`}
                    >
                      {getStatusPercentage(progress.status)}%
                    </p>
                  </div>
                </div>
                <div
                  className={`flex flex-col items-center ${getStatusBarClass(
                    progress.status
                  )}`}
                >
                  <div
                    className={` ${getStatusFillClass(progress.status)} `}
                  ></div>
                </div>
              </div>
              <p>Ghi chú: {progress.note || "Không có ghi chú"}</p>
              <p>
                Thời điểm cập nhật: {formatDateToLocale(progress.updatedAt)}
              </p>
              {progress.schedule && (
                <p>Lịch hẹn: {formatDateToLocale(progress.schedule)}</p>
              )}
              {progress.workers && progress.workers.length > 0 ? (
                <div className="mt-4">
                  <p className="text-lg font-semibold">Các công nhân:</p>
                  <table className="w-full border-collapse border-t border-gray-300 mt-2">
                    <thead>
                      <tr>
                        <th align="center" className="py-2">
                          Họ và tên
                        </th>
                        <th align="center" className="py-2">
                          Số điện thoại
                        </th>
                        <th align="center" className="py-2">
                          Tuổi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {progress.workers.map((worker, workerIndex) => (
                        <tr key={workerIndex}>
                          <td align="center" className="py-2">
                            {worker.name}
                          </td>
                          <td align="center" className="py-2">
                            {worker.phoneNumber}
                          </td>
                          <td align="center" className="py-2">
                            {worker.age}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-4">Chưa có công nhân nào được giao lắp đặt</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AccountOrder = () => {
  const { accessToken } = useAppSelector((state) => state.authReducer);
  const [transactions, setTransactions] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(false);
  const [dataOrder, setDataOrder] = useState(false);

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

  const openModal = (order) => {
    console.log(order._id);

    const fetchData = async () => {
      const data = await customAxios.get(
        `/v1/transactions/me/${order._id}`,
        null,
        {
          access: accessToken,
        }
      );
      console.log(data.data.data);

      setDataOrder(data.data.data);
    };
    fetchData();
    // setSelectedOrder(order);
  };

  const closeModal = () => {
    setDataOrder(false);
  };

  const renderProductItem = (product: any, index: number) => {
    if (!product) return null;
    const { productDetail, amount } = product;
    console.log(
      "🚀 ~ file: page.tsx:309 ~ renderProductItem ~ productDetail:",
      productDetail
    );
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
              <Prices className="mt-0.5 ml-2" price={productDetail?.price} />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400 flex items-center">
              <span className="hidden sm:inline-block">SL</span>
              <span className="inline-block sm:hidden">SL</span>
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
              <span className="text-primary-500">
                {TRANSACTION_STATUS[status]}
              </span>
              <span className="mx-2">·</span>
              <span className="text-primary-500">
                {TRANSACTION_PAYMENT_METHOD[paymentMethod]}
              </span>
            </p>
          </div>
          <div className="mt-3 sm:mt-0">
            <ButtonSecondary
              sizeClass="py-2.5 px-4 sm:px-6"
              fontSize="text-sm font-medium"
              onClick={() => openModal(transaction)}
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
      <OrderDetailsModal order={dataOrder} onClose={closeModal} />
    </div>
  );
};

export default AccountOrder;

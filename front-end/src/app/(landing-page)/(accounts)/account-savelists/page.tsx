"use client";

import { IProduct } from "@/api/product/dto/get-products.dto";
import {
  GET_FAVORITE_PRODUCTS,
  TOGGLE_FAVORITE_PRODUCT,
} from "@/api/user/endpoints";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS } from "@/data/data";
import { customAxios } from "@/http-service/fetchAPI";
import { toggleFavouriteProductAsync } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import ButtonSecondary from "@/shared/Button/ButtonSecondary";
import { loadState } from "@/utils/localStorage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AccountSavelists = () => {
  const [savedProducts, setSavedProducts] = useState<IProduct[]>([]);
  const dispatch = useAppDispatch();
  const fetchSavedProducts = async (mounted: boolean) => {
    const response = await customAxios.get(GET_FAVORITE_PRODUCTS, null, {
      access: loadState("accessToken"),
    });

    if (mounted) return null;

    if (response.data && response.data.statusCode === 200) {
      return response.data.data;
    }

    return null;
  };
  const toggleLikeAsync = async (id: string) => {
    dispatch(toggleFavouriteProductAsync(id));
  };
  const router = useRouter();

  useEffect(() => {
    let mounted = false;

    fetchSavedProducts(mounted).then((res) => {
      if (res) {
        setSavedProducts(res);
      }
    });

    return () => {
      mounted = true;
    };
  }, []);

  return (
    <div className="space-y-10 sm:space-y-12">
      <div>
        <h2 className="text-2xl sm:text-3xl font-semibold">
          Danh sách sản phẩm yêu thích
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 ">
        {savedProducts.length > 0 ? (
          savedProducts.map((i, idx) => {
            return (
              <ProductCard key={idx} data={i} toggleLike={toggleLikeAsync} />
            );
          })
        ) : (
          <>
            <div className="flex justify-center items-center"></div>
            <p className="text-lg">Không có sản phẩm nào được yêu thích</p>
          </>
        )}
      </div>
      <div className="flex !mt-20 justify-center items-center">
        <ButtonSecondary
          onClick={() => {
            router.push("/collection");
          }} /*loading*/
        >
          Xem thêm
        </ButtonSecondary>
      </div>
    </div>
  );
};

export default AccountSavelists;

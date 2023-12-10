"use client";

import React, { FC } from "react";
import HeaderFilterSection from "@/components/HeaderFilterSection";
import ProductCard from "@/components/ProductCard";
import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import { Product, PRODUCTS } from "@/data/data";
import { TOGGLE_FAVORITE_PRODUCT } from "@/api/user/endpoints";
import { customAxios } from "@/http-service/fetchAPI";
import { loadState } from "@/utils/localStorage";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleFavouriteProductAsync } from "@/redux/features/authSlice";

//
export interface SectionGridFeatureItemsProps {
  data?: Product[];
}
//! Component not used in the project
const SectionGridFeatureItems: FC<SectionGridFeatureItemsProps> = ({
  data = PRODUCTS,
}) => {
  const dispatch = useAppDispatch();
  const { favouriteProducts } = useAppSelector((state) => state.authReducer);
  const toggleLikeAsync = async (id: string) => {
    dispatch(toggleFavouriteProductAsync(id));
  };
  return (
    <div className="nc-SectionGridFeatureItems relative">
      <HeaderFilterSection />
      <div
        className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 `}
      >
        {data.map((item, index) => (
          <ProductCard toggleLike={toggleLikeAsync} data={item} key={index} />
        ))}
      </div>
      <div className="flex mt-16 justify-center items-center">
        <ButtonPrimary loading>Show me more</ButtonPrimary>
      </div>
    </div>
  );
};

export default SectionGridFeatureItems;

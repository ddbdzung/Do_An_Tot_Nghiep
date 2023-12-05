"use client";

import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import { Pagination } from "@mui/material";
import React from "react";
import ProductCard from "../ProductCard";
import { useAppSelector } from "@/redux/hooks";
import { customAxios } from "@/http-service/fetchAPI";
import { SEARCH_PRODUCTS } from "@/api/product/endpoints";

export default function CollectionSection() {
  const { products } = useAppSelector((state) => state.productReducer);
  const [list, setList] = React.useState<any[]>([]);
  React.useEffect(() => {
    let mounted = false;
    if (!mounted) {
      customAxios
        .get(SEARCH_PRODUCTS({ price: { min: 1, max: 20000 } }))
        .then((res) => {
          if (res.data.statusCode === 200) {
            setList(res.data.data.results);
          }
        })
        .catch((err) => console.error(err));
    }

    return () => {
      mounted = true;
    };
  }, []);

  React.useEffect(() => {
    setList(products);
  }, [products]);
  return (
    <>
      {/* LOOP ITEMS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 mt-8 lg:mt-10">
        {Array.isArray(list) &&
          list.length > 0 &&
          list?.map((item, index) => <ProductCard data={item} key={index} />)}
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
        <Pagination />
        {/* <ButtonPrimary loading>Show me more</ButtonPrimary> */}
      </div>
    </>
  );
}

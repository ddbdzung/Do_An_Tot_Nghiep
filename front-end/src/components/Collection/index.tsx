"use client";

import ButtonPrimary from "@/shared/Button/ButtonPrimary";
import { Pagination } from "@mui/material";
import React from "react";
import ProductCard from "../ProductCard";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { customAxios } from "@/http-service/fetchAPI";
import { SEARCH_PRODUCTS } from "@/api/product/endpoints";
import { loadState } from "@/utils/localStorage";
import { TOGGLE_FAVORITE_PRODUCT } from "@/api/user/endpoints";
import { toggleFavouriteProductAsync } from "@/redux/features/authSlice";
import { ISearchProductsDto } from "@/api/product/dto/search-products.dto";

export default function CollectionSection({
  searchName,
}: {
  searchName: string;
}) {
  const { products } = useAppSelector((state) => state.productReducer);
  const [page, setPage] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalItems, setTotalItems] = React.useState(0);

  const dispatch = useAppDispatch();
  const [list, setList] = React.useState<any[]>([]);
  React.useEffect(() => {
    let mounted = false;
    if (!mounted) {
      const query: ISearchProductsDto = {
        price: { min: 1, max: 20000 },
      };
      if (searchName) query.name = searchName;

      customAxios
        .get(SEARCH_PRODUCTS(query))
        .then((res) => {
          if (res.data.statusCode === 200) {
            setList(res.data.data.results);
            setTotalPage(res.data.data.totalPages);
            setPageSize(res.data.data.limit);
            setPage(res.data.data.page);
            setTotalItems(res.data.data.totalResults);
          }
        })
        .catch((err) => console.error(err));
    }

    return () => {
      mounted = true;
    };
  }, []);

  React.useEffect(() => {
    const query: ISearchProductsDto = {
      price: { min: 1, max: 20000 },
    };
    if (searchName) query.name = searchName;

    customAxios
      .get(SEARCH_PRODUCTS(query))
      .then((res) => {
        if (res.data.statusCode === 200) {
          setList(res.data.data.results);
          setTotalPage(res.data.data.totalPages);
          setPageSize(res.data.data.limit);
          setPage(res.data.data.page);
          setTotalItems(res.data.data.totalResults);
        }
      })
      .catch((err) => console.error(err));
  }, [searchName]);

  const toggleLikeAsync = async (id: string) => {
    dispatch(toggleFavouriteProductAsync(id));
  };

  React.useEffect(() => {
    setList(products);
  }, [products]);

  const handleNavigatePagePagination = (e: React.ChangeEvent, page: number) => {
    const query: ISearchProductsDto = {
      price: { min: 1, max: 20000 },
      page,
    };
    if (searchName) query.name = searchName;

    customAxios
      .get(SEARCH_PRODUCTS(query))
      .then((res) => {
        if (res.data.statusCode === 200) {
          setList(res.data.data.results);
          setTotalPage(res.data.data.totalPages);
          setPageSize(res.data.data.limit);
          setPage(res.data.data.page);
        }
      })
      .catch((err) => console.error(err));
  };
  return (
    <>
      {/* LOOP ITEMS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 mt-8 lg:mt-10">
        {Array.isArray(list) &&
          list.length > 0 &&
          list?.map((item, index) => (
            <ProductCard toggleLike={toggleLikeAsync} data={item} key={index} />
          ))}
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
        <Pagination
          color="primary"
          count={totalPage}
          defaultPage={1}
          onChange={(e: React.ChangeEvent, page: number) =>
            handleNavigatePagePagination(e, page)
          }
        />

        <span className="hidden sm:block text-neutral-500 dark:text-neutral-400 text-sm sm:text-base">
          Showing {pageSize * (page - 1) + 1} -{" "}
          {pageSize * (page - 1) + list.length} of {totalItems} results
        </span>
        {/* <ButtonPrimary loading>Show me more</ButtonPrimary> */}
      </div>
    </>
  );
}

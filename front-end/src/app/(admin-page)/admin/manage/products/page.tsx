"use client";

import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";
import ProductTable, { headersType } from "./Table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getProductsAsync } from "@/redux/features/adminSlice";
import { useEffect, useState } from "react";
import withAuth from "@/shared/PrivateRoute";
import { throttle } from "lodash";

const headers: headersType = [
  {
    title: "Name",
  },
  {
    title: "Category",
  },
  {
    title: "Brand",
  },
  {
    title: "Price",
    align: "right",
  },
  {
    title: "Quantity",
    align: "right",
  },
  {
    title: "Updated At",
    align: "left",
  },
  {
    title: "Actions",
    align: "center",
  },
];

const throttleReloadGetProducts = throttle(
  async function (dispatch: (...arg: any) => any) {
    dispatch(
      getProductsAsync({
        limit: 30,
        page: 1,
      })
    );
  },
  3000,
  {
    trailing: false,
  }
);

function ManageProductPage() {
  const { formStatus, products } = useAppSelector(
    (state) => state.adminReducer
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      getProductsAsync({
        limit: 30,
        page: 1,
      })
    );
  }, []);
  const handleReloadBtn = () => {
    throttleReloadGetProducts(dispatch);
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" marginBottom="1rem">
        <Typography variant="h5" gutterBottom>
          Products
        </Typography>
        <Box>
          <Button
            variant="contained"
            onClick={handleReloadBtn}
            style={{ marginRight: "1rem" }}
          >
            Reload
          </Button>
          <Link href="/admin/manage/products/c">
            <Button variant="contained">Create</Button>
          </Link>
        </Box>
      </Box>
      <ProductTable
        headers={headers}
        status={formStatus}
        rows={products ? products : []}
      />
    </>
  );
}

export default withAuth({ requiredRights: ["get_products"] })(
  ManageProductPage
);

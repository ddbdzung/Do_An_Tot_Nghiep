"use client";

import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";
import OrderTable, { headersType } from "./Table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getProductsAsync,
  getTransactionsAsync,
} from "@/redux/features/adminSlice";
import { useEffect, useState } from "react";
import withAuth from "@/shared/PrivateRoute";
import { throttle } from "lodash";

const headers: headersType = [
  {
    title: "Customer Name",
  },
  {
    title: "Customer Phone Number",
    align: "right",
  },
  {
    title: "Status",
  },
  {
    title: "Total Price",
    align: "right",
  },
  {
    title: "Updated At",
    align: "left",
  },
  {
    title: "Created At",
    align: "left",
  },
  {
    title: "Actions",
    align: "center",
  },
];

const throttleReloadGetTranscations = throttle(
  async function (dispatch: (...arg: any) => any) {
    dispatch(
      getTransactionsAsync({
        limit: 8,
        page: 1,
      })
    );
  },
  3000,
  {
    trailing: false,
  }
);

function ManageTransactionPage() {
  const { formStatus, transactions } = useAppSelector(
    (state) => state.adminReducer
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      getTransactionsAsync({
        limit: 8,
        page: 1,
      })
    );
  }, []);
  const handleReloadBtn = () => {
    throttleReloadGetTranscations(dispatch);
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" marginBottom="1rem">
        <Typography variant="h5" gutterBottom>
          Orders
        </Typography>
        <Box>
          <Button
            variant="contained"
            onClick={handleReloadBtn}
            style={{ marginRight: "1rem" }}
          >
            Reload
          </Button>
          <Link href="/admin/manage/orders/c">
            <Button variant="contained">Create</Button>
          </Link>
        </Box>
      </Box>
      <OrderTable
        headers={headers}
        status={formStatus}
        rows={_.isEmpty(transactions) ? [] : transactions}
      />
    </>
  );
}

export default withAuth({
  requiredRights: ["get_transactions", "manage_transactions"],
})(ManageTransactionPage);

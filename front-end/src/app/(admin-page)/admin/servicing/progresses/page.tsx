"use client";

import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";
import ProgressTable, { headersType } from "./Table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getProductsAsync,
  getProgressesAsync,
  getTransactionsAsync,
} from "@/redux/features/adminSlice";
import { useEffect, useState } from "react";
import withAuth from "@/shared/PrivateRoute";
import { throttle } from "lodash";

const headers: headersType = [
  {
    title: "Transaction ID",
  },
  {
    title: "Customer Name",
  },
  {
    title: "Transaction Status",
  },
  {
    title: "Progress Status",
  },
  {
    title: "Updated At",
  },
  {
    title: "Created At",
  },
  {
    title: "Actions",
    align: "center",
  },
];

const throttleReloadGetProgresses = throttle(
  async function (dispatch: (...arg: any) => any) {
    dispatch(
      getProgressesAsync({
        limit: 30,
        page: 1,
      })
    );
    dispatch(
      getTransactionsAsync({
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

function ManageProgressPage() {
  const { formStatus, progresses } = useAppSelector(
    (state) => state.adminReducer
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      getProgressesAsync({
        limit: 30,
        page: 1,
      })
    );
  }, []);
  const handleReloadBtn = () => {
    throttleReloadGetProgresses(dispatch);
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" marginBottom="1rem">
        <Typography variant="h5" gutterBottom>
          Progresses
        </Typography>
        <Box>
          <Button
            variant="contained"
            onClick={handleReloadBtn}
            style={{ marginRight: "1rem" }}
          >
            Reload
          </Button>
          <Link href="/admin/servicing/progresses/c">
            <Button variant="contained">Create</Button>
          </Link>
        </Box>
      </Box>
      <ProgressTable
        headers={headers}
        status={formStatus}
        rows={_.isEmpty(progresses) ? [] : progresses}
      />
    </>
  );
}

export default withAuth({
  requiredRights: ["get_progresses", "manage_progresses"],
})(ManageProgressPage);

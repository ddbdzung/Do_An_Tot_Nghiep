"use client";

import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";
import CategoryTable, { headersType } from "./Table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getCategoriesAsync } from "@/redux/features/adminSlice";
import { useEffect, useState } from "react";
import withAuth from "@/shared/PrivateRoute";
import { throttle } from "lodash";

const headers: headersType = [
  {
    title: "Name",
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

const throttleReloadGetCategories = throttle(
  async function (dispatch: (...arg: any) => any) {
    dispatch(
      getCategoriesAsync({
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

function ManageCategoryPage() {
  const { formStatus, categories } = useAppSelector(
    (state) => state.adminReducer
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      getCategoriesAsync({
        limit: 30,
        page: 1,
      })
    );
  }, []);
  const handleReloadBtn = () => {
    throttleReloadGetCategories(dispatch);
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" marginBottom="1rem">
        <Typography variant="h5" gutterBottom>
          Categories
        </Typography>
        <Box>
          <Button
            variant="contained"
            onClick={handleReloadBtn}
            style={{ marginRight: "1rem" }}
          >
            Reload
          </Button>
          <Link href="/admin/manage/categories/c">
            <Button variant="contained">Create</Button>
          </Link>
        </Box>
      </Box>
      <CategoryTable
        headers={headers}
        status={formStatus}
        rows={categories ? categories : []}
      />
    </>
  );
}

export default withAuth({ requiredRights: ["get_categories"] })(
  ManageCategoryPage
);

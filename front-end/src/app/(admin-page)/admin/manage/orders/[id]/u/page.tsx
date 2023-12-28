"use client";

import * as Yup from "yup";
import ModalImage from "react-modal-image";
import { ICreateProductBodyDto } from "@/api/product/dto/create-product.dto";
import {
  AdminFormStatus,
  adminUpdateProductAsync,
  createProductAsync,
  getCategoriesAsync,
  updateTransactionAsync,
} from "@/redux/features/adminSlice";
import {
  Box,
  Button,
  Grid,
  ImageList,
  ImageListItem,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { Form, FormikHelpers, useFormik } from "formik";
import { throttle, uniqueId } from "lodash";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import withAuth from "@/shared/PrivateRoute";
import { fetchGetProduct } from "@/redux/services/productApi";
import { IResponsePayload } from "@/http-service/response-handler";
import { IProduct } from "@/api/product/dto/get-products.dto";
import {
  IUpdateProductBodyDto,
  IUpdateProductDto,
} from "@/api/product/dto/update-product.dto";
import { getChangedValues } from "@/utils/getChangesObject";
import { notifyError, notifyPromise } from "@/utils/notify";
import Image from "next/image";
import { renderImageCloudinary } from "@/utils/renderImage";
import { IUpdateTransactionDto } from "@/api/transactions/dto/update-transaction.dto";
import { fetchGetTransaction } from "@/redux/services/checkoutApi";
import { ITransaction } from "@/api/transactions/dto/transaction.dto";
import { TRANSACTION_STATUS } from "./constants";

const throttleUpdate = throttle(
  async function (
    values: any,
    actions: FormikHelpers<any>,
    dispatch: (...arg: any) => any
  ) {
    dispatch(updateTransactionAsync(values as IUpdateTransactionDto));
  },
  1000,
  { trailing: false }
);

function UpdateProductPage() {
  const transactionStatus = Object.values(TRANSACTION_STATUS);
  const router = useRouter();
  const { id } = useParams();

  const { accessToken, formStatus } = useAppSelector(
    (state) => state.authReducer
  );
  const [transaction, setTransaction] = useState<ITransaction | null>(null);

  const fetchTransactionPromise = (mounted: boolean) =>
    fetchGetTransaction({ access: accessToken }, { id }).then(
      (res: IResponsePayload<ITransaction>) => {
        if (mounted) {
          if (res.statusCode !== 200) {
            notifyError(res.message);
            snooze(1000).then(() => {
              router.back();
            });
          } else {
            setTransaction(res.data);
          }
        }
      }
    );

  useEffect(() => {
    let mounted = true;
    notifyPromise(fetchTransactionPromise(mounted), {
      successMessage: "Get transaction successfully",
      errorMessage: "Get transaction failed",
    });

    return () => {
      mounted = false;
    };
  }, []);
  const handleGoBackBtn = () => {
    router.back();
  };
  const handleResetBtn = () => {
    formik.resetForm();
  };
  const dispatch = useAppDispatch();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      status: transaction?.status ?? "",
    },
    validationSchema: Yup.object({
      status: Yup.string().required("Required").oneOf(transactionStatus),
    }),
    onSubmit: (values, actions) => {
      const payload: IUpdateTransactionDto = {
        params: { id },
        body: values,
      };
      throttleUpdate(payload, actions, dispatch);
    },
  });
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box display="flex" justifyContent="space-between" marginBottom="1rem">
          <Typography variant="h5" gutterBottom>
            Update Transaction
          </Typography>
          <Box display="flex" justifyContent="space-between" gap="0.25rem">
            {formStatus && formStatus === AdminFormStatus.IDLE ? (
              <Button type="submit" variant="contained" color="info">
                Update
              </Button>
            ) : (
              <Button type="submit" variant="contained" color="info">
                <span className="mx-2">Loading</span>
                <svg
                  role="status"
                  className="inline mr-3 w-4 h-4 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
              </Button>
            )}
            <Button onClick={handleResetBtn} type="reset" variant="contained">
              Reset
            </Button>
            <Button onClick={handleGoBackBtn} type="button" variant="contained">
              Go back
            </Button>
          </Box>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Customer Name"
              variant="outlined"
              fullWidth
              type="text"
              id="customerName"
              name="customerName"
              value={transaction?.customerInfo.name ?? ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Customer Phone Number"
              variant="outlined"
              fullWidth
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={transaction?.customerInfo.phoneNumber ?? ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              type="text"
              id="address"
              name="address"
              value={transaction?.customerInfo.address ?? ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Payment method"
              variant="outlined"
              fullWidth
              type="text"
              id="paymentMethod"
              name="paymentMethod"
              value={transaction?.paymentMethod ?? ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={9}>
            <InputLabel id="status">Status</InputLabel>
            <Select
              labelId="status"
              id="status"
              name="status"
              label="Status"
              size="medium"
              value={formik.values.status}
              onChange={formik.handleChange}
            >
              {transactionStatus?.map((status) => (
                <MenuItem key={uniqueId()} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.status && formik.errors.status && (
              <span
                style={{
                  marginLeft: "8px",
                  fontSize: "1rem",
                  lineHeight: "1.25rem",
                  color: "rgb(239, 68, 68)",
                }}
              >
                {formik.errors.status}
              </span>
            )}
          </Grid>
        </Grid>
      </form>
    </>
  );
}

export default withAuth({
  requiredRights: [
    "get_transaction",
    "update_transactions",
    "manage_transactions",
  ],
})(UpdateProductPage);

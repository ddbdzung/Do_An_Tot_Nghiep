"use client";

import ModalImage from "react-modal-image";
import * as Yup from "yup";
import { ICreateProductBodyDto } from "@/api/product/dto/create-product.dto";
import {
  AdminFormStatus,
  createCategoryAsync,
  createProductAsync,
  getCategoriesAsync,
} from "@/redux/features/adminSlice";
import {
  Box,
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { FormikHelpers, useFormik } from "formik";
import { throttle } from "lodash";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import withAuth from "@/shared/PrivateRoute";

const throttleCreate = throttle(
  async function (
    values: any,
    actions: FormikHelpers<any>,
    dispatch: (...arg: any) => any
  ) {
    const payload: ICreateProductBodyDto = {
      name: values.name,
    };
    if (values.images) {
      payload.images = values.images;
    }
    console.log("payload123", payload);

    dispatch(createCategoryAsync(payload));
  },
  1000,
  { trailing: false }
);

function CreateCategoryPage() {
  const router = useRouter();
  const { formStatus, categories } = useAppSelector(
    (state) => state.adminReducer
  );

  const [previewImage, setPreviewImage] = useState(null);
  const handleSetPreview = (event) => {
    const reader = new FileReader();
    if (event.target.files.length > 0) {
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
    }
  };
  const handleGoBackBtn = () => {
    router.back();
  };
  const handleResetBtn = () => {
    formik.resetForm();
  };
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required").trim(),
    }),
    onSubmit: (values, actions) => {
      if (previewImage) {
        values.images = [
          {
            blob: previewImage,
            pos: 0,
          },
        ];
      }
      throttleCreate(values, actions, dispatch);
    },
  });
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box display="flex" justifyContent="space-between" marginBottom="1rem">
          <Typography variant="h5" gutterBottom>
            Create Category
          </Typography>
          <Box display="flex" justifyContent="space-between" gap="0.25rem">
            {formStatus && formStatus === AdminFormStatus.IDLE ? (
              <Button type="submit" variant="contained" color="info">
                Create
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
            <Button onClick={handleGoBackBtn} variant="contained">
              Go back
            </Button>
          </Box>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              type="text"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            {formik.touched.name && formik.errors.name && (
              <span
                style={{
                  fontSize: "1rem",
                  lineHeight: "1.25rem",
                  color: "rgb(239, 68, 68)",
                }}
              >
                {formik.errors.name}
              </span>
            )}
          </Grid>
        </Grid>
        <div>
          <Typography
            variant="subtitle1"
            style={{ marginTop: "4px", marginBottom: "-8px" }}
          >
            Front Image
          </Typography>
          <div>
            <input type="file" onChange={handleSetPreview} />
          </div>
          {previewImage && (
            <div>
              <ModalImage
                small={
                  previewImage.length > 255
                    ? previewImage
                    : "https://res.cloudinary.com/dbbifu1w6/image/upload/c_scale/v1/" +
                      previewImage
                }
                medium={
                  previewImage.length > 255
                    ? previewImage
                    : "https://res.cloudinary.com/dbbifu1w6/image/upload/c_scale/v1/" +
                      previewImage
                }
                large={
                  previewImage.length > 255
                    ? previewImage
                    : "https://res.cloudinary.com/dbbifu1w6/image/upload/c_scale,w_1700/v1/" +
                      previewImage
                }
                alt="Ảnh chính"
              />
              <button
                className="bg-black text-white font-bold p-2"
                onClick={() => setPreviewImage(null)}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </form>
    </>
  );
}

export default withAuth({
  requiredRights: ["create_product", "get_categories"],
})(CreateCategoryPage);

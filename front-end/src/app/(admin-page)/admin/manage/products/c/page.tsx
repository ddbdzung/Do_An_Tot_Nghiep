"use client";

import ModalImage from "react-modal-image";
import * as Yup from "yup";
import { ICreateProductBodyDto } from "@/api/product/dto/create-product.dto";
import {
  AdminFormStatus,
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
      brand: values.brand,
      quantity: values.quantity,
      price: values.price,
      categoryId: values.categoryId,
      unit: values.unit,
    };
    if (values.images) {
      payload.images = values.images;
    }
    if (values.description) {
      payload.description = values.description;
    }
    if (values.details) {
      payload.details = values.description;
    }

    dispatch(createProductAsync(payload));
  },
  1000,
  { trailing: false }
);

function CreateProductPage() {
  const router = useRouter();
  const { formStatus, categories } = useAppSelector(
    (state) => state.adminReducer
  );

  const [previewImage, setPreviewImage] = useState(null);
  const [previewImageList, setPreviewImageList] = useState([]);
  const handleSetPreview = (event) => {
    const reader = new FileReader();
    if (event.target.files.length > 0) {
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
    }
  };
  const handleSetPreviewList = (event) => {
    const files = event.target.files;
    let fileArr = [];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(files[i]);
      reader.onloadend = () => {
        fileArr.push(reader.result);
      };
    }
    setPreviewImageList(fileArr);
  };
  useEffect(() => {
    dispatch(
      getCategoriesAsync({
        limit: 100,
        page: 1,
      })
    );
  }, []);
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
      brand: "",
      quantity: "",
      price: "",
      description: "",
      categoryId: "",
      unit: "",
      details: "",
      images: [],
      details: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required").trim(),
      brand: Yup.string().required("Required").trim(),
      quantity: Yup.number().min(0).required("Required"),
      price: Yup.number().min(1).required("Required"),
      categoryId: Yup.string().required("Required"),
      description: Yup.string().trim(),
      unit: Yup.string().required("Required").trim(),
      details: Yup.string().trim(),
    }),
    onSubmit: (values, actions) => {
      if (previewImage) {
        values.images.push({
          blob: previewImage,
          pos: 0,
        });
      }
      if (previewImageList?.length > 0) {
        for (let i = 0; i < previewImageList.length; i++) {
          values.images.push({
            blob: previewImageList[i],
            pos: i + 1,
          });
        }
      }
      throttleCreate(values, actions, dispatch);
      router.push("/admin/manage/products");
    },
  });
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box display="flex" justifyContent="space-between" marginBottom="1rem">
          <Typography variant="h5" gutterBottom>
            Create Product
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
          <Grid item xs={12} sm={3}>
            <TextField
              label="Brand"
              variant="outlined"
              fullWidth
              type="text"
              id="brand"
              name="brand"
              value={formik.values.brand}
              onChange={formik.handleChange}
            />
            {formik.touched.brand && formik.errors.brand && (
              <span
                style={{
                  fontSize: "1rem",
                  lineHeight: "1.25rem",
                  color: "rgb(239, 68, 68)",
                }}
              >
                {formik.errors.brand}
              </span>
            )}
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Quantity"
              variant="outlined"
              fullWidth
              type="text"
              id="quantity"
              name="quantity"
              value={formik.values.quantity}
              onChange={formik.handleChange}
            />
            {formik.touched.quantity && formik.errors.quantity && (
              <span
                style={{
                  fontSize: "1rem",
                  lineHeight: "1.25rem",
                  color: "rgb(239, 68, 68)",
                }}
              >
                {formik.errors.quantity}
              </span>
            )}
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Price"
              variant="outlined"
              fullWidth
              type="text"
              id="price"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
            />
            {formik.touched.price && formik.errors.price && (
              <span
                style={{
                  fontSize: "1rem",
                  lineHeight: "1.25rem",
                  color: "rgb(239, 68, 68)",
                }}
              >
                {formik.errors.price}
              </span>
            )}
          </Grid>
          <Grid item xs={12} sm={9}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              type="text"
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              multiline={true}
              rows={3}
            />
            {formik.touched.description && formik.errors.description && (
              <span
                style={{
                  margin: "0.1rem",
                  fontSize: "1rem",
                  lineHeight: "1.25rem",
                  color: "rgb(239, 68, 68)",
                }}
              >
                {formik.errors.description}
              </span>
            )}
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Unit"
              variant="outlined"
              fullWidth
              type="text"
              id="unit"
              name="unit"
              value={formik.values.unit}
              onChange={formik.handleChange}
            />
            {formik.touched.unit && formik.errors.unit && (
              <span
                style={{
                  fontSize: "1rem",
                  lineHeight: "1.25rem",
                  color: "rgb(239, 68, 68)",
                }}
              >
                {formik.errors.unit}
              </span>
            )}
          </Grid>
          <Grid item xs={12} sm={9}>
            <TextField
              label="Details"
              variant="outlined"
              fullWidth
              type="text"
              id="details"
              name="details"
              multiline={true}
              rows={3}
              value={formik.values.details}
              onChange={formik.handleChange}
            />
            {formik.touched.details && formik.errors.details && (
              <span
                style={{
                  fontSize: "1rem",
                  lineHeight: "1.25rem",
                  color: "rgb(239, 68, 68)",
                }}
              >
                {formik.errors.details}
              </span>
            )}
          </Grid>
          <Grid item xs={12} sm={9}>
            <InputLabel id="categoryId">Category</InputLabel>
            <Select
              labelId="categoryId"
              id="categoryId"
              name="categoryId"
              label="Category"
              size="medium"
              value={formik.values.categoryId}
              onChange={formik.handleChange}
            >
              {categories?.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.categoryId && formik.errors.categoryId && (
              <span
                style={{
                  marginLeft: "8px",
                  fontSize: "1rem",
                  lineHeight: "1.25rem",
                  color: "rgb(239, 68, 68)",
                }}
              >
                {formik.errors.categoryId}
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
          <Typography
            variant="subtitle1"
            style={{ marginTop: "4px", marginBottom: "-8px" }}
          >
            Sub Image
          </Typography>
          <div className="tablet:ml-60">
            <div>
              <input
                type="file"
                onChange={(e) => {
                  handleSetPreviewList(e);
                }}
                multiple
              />
            </div>
            {previewImageList?.length > 0 &&
              previewImageList.map((image, idx) => (
                <div key={idx}>
                  <ModalImage
                    small={
                      image.length > 255
                        ? image
                        : "https://res.cloudinary.com/dbbifu1w6/image/upload/c_scale/v1/" +
                          image
                    }
                    medium={
                      image.length > 255
                        ? image
                        : "https://res.cloudinary.com/dbbifu1w6/image/upload/c_scale/v1/" +
                          image
                    }
                    large={
                      image.length > 255
                        ? image
                        : "https://res.cloudinary.com/dbbifu1w6/image/upload/c_scale,w_1700/v1/" +
                          image
                    }
                    alt="Ảnh phụ"
                  />
                </div>
              ))}
          </div>
        </div>
      </form>
    </>
  );
}

export default withAuth({
  requiredRights: ["create_product", "get_categories"],
})(CreateProductPage);

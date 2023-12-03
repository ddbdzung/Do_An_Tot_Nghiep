"use client";

import * as Yup from "yup";
import {
  AdminFormStatus,
  adminGetProductAsync,
} from "@/redux/features/adminSlice";
import {
  Box,
  Button,
  FormControl,
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
import { throttle } from "lodash";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { use, useEffect, useState } from "react";
import withAuth from "@/shared/PrivateRoute";
import { IProduct } from "@/api/product/dto/get-products.dto";
import { fetchGetProduct } from "@/redux/services/productApi";
import { IResponsePayload } from "@/http-service/response-handler";
import { notifyError } from "@/utils/notify";
import { snooze } from "@/utils/snooze";
import Image from "next/image";
import { renderImageCloudinary } from "@/utils/renderImage";

function ViewProductPage() {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.authReducer);
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  useEffect(() => {
    let mounted = true;
    fetchGetProduct({ access: accessToken }, { id }).then(
      (res: IResponsePayload<IProduct>) => {
        if (mounted) {
          if (res.statusCode !== 200) {
            notifyError(res.message);
            snooze(1000).then(() => {
              router.back();
            });
          } else {
            setProduct(res.data);
          }
        }
      }
    );

    return () => {
      mounted = false;
    };
  }, []);
  const handleGoBackBtn = () => {
    navigation.back();
  };
  return (
    <>
      <Box display="flex" justifyContent="space-between" marginBottom="1rem">
        <Typography variant="h5" gutterBottom>
          Product Detail
        </Typography>
        <Button onClick={handleGoBackBtn} variant="contained">
          Go back
        </Button>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <label>Name</label>
          <TextField
            variant="outlined"
            fullWidth
            type="text"
            id="name"
            name="name"
            value={product?.name}
            disabled={product?.name ? false : true}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <label>Brand</label>
          <TextField
            variant="outlined"
            fullWidth
            type="text"
            id="brand"
            name="brand"
            value={product?.brand}
            disabled={product?.brand ? false : true}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <label>Quantity</label>
          <TextField
            variant="outlined"
            fullWidth
            type="text"
            id="quantity"
            name="quantity"
            value={product?.quantity}
            disabled={product?.quantity ? false : true}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <label>Price</label>
          <TextField
            variant="outlined"
            fullWidth
            type="text"
            id="price"
            name="price"
            value={product?.price.lastValue}
            disabled={product?.price.lastValue ? false : true}
          />
        </Grid>
        <Grid item xs={12} sm={9}>
          <label>Description</label>
          <TextField
            variant="outlined"
            fullWidth
            type="text"
            id="description"
            name="description"
            multiline={true}
            rows={3}
            value={product?.description}
            disabled={product?.description ? false : true}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <label>Unit</label>
          <TextField
            variant="outlined"
            fullWidth
            type="text"
            id="unit"
            name="unit"
            value={product?.unit}
            disabled={product?.unit ? false : true}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <label>Category</label>
          <TextField
            variant="outlined"
            fullWidth
            type="text"
            id="category"
            name="category"
            value={product?.category?.name}
            disabled={product?.category?.id ? false : true}
          />
        </Grid>
      </Grid>
      <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
        {product?.images.map((item) => (
          <ImageListItem key={item.url}>
            <Image
              src={renderImageCloudinary(item.url)}
              alt={item?.alt || ""}
              width={500}
              height={450}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );
}

export default withAuth({
  requiredRights: ["get_product"],
})(ViewProductPage);

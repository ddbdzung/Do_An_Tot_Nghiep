"use client";

import * as Yup from "yup";
import { AdminFormStatus } from "@/redux/features/adminSlice";
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
import { IResponsePayload } from "@/http-service/response-handler";
import { notifyError } from "@/utils/notify";
import { snooze } from "@/utils/snooze";
import Image from "next/image";
import { renderImageCloudinary } from "@/utils/renderImage";
import { ICategory } from "@/api/category/dto/category.dto";
import { fetchGetCategory } from "@/redux/services/categoryApi";

function ViewCategoryPage() {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.authReducer);
  const router = useRouter();
  const { id } = useParams();
  const [category, setCategory] = useState<ICategory | null>(null);
  console.log("category", category);
  useEffect(() => {
    let mounted = true;
    fetchGetCategory({ access: accessToken }, { id }).then(
      (res: IResponsePayload<ICategory>) => {
        if (mounted) {
          if (res.statusCode !== 200) {
            notifyError(res.message);
            snooze(1000).then(() => {
              router.back();
            });
          } else {
            setCategory(res.data);
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
      <div style={{ width: "100%" }}>
        <Box display="flex" justifyContent="space-between" marginBottom="1rem">
          <Typography variant="h5" gutterBottom>
            Category Detail
          </Typography>
          <Button onClick={handleGoBackBtn} variant="contained">
            Go back
          </Button>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <label>Name</label>
            <TextField
              variant="outlined"
              fullWidth
              type="text"
              id="name"
              name="name"
              value={category?.name}
              disabled={category?.name ? false : true}
            />
          </Grid>
        </Grid>
        <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
          {Array.isArray(category?.images) &&
            category?.images?.map((item) => (
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
      </div>
    </>
  );
}

export default withAuth({
  requiredRights: ["get_category"],
})(ViewCategoryPage);

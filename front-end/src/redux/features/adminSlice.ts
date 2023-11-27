import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  Action,
} from "@reduxjs/toolkit";
import { handleResponsePayload } from "@/http-service/response-handler";
import { notifyError } from "@/utils/notify";
import { HttpMessage } from "@/http-service/http-message";
import { loadState, saveState } from "@/utils/localStorage";
import {
  fetchCreateProduct,
  fetchDeleteProduct,
  fetchGetProduct,
  fetchGetProducts,
  fetchUpdateProduct,
} from "../services/productApi";
import {
  IGetProductsQueryDto,
  IGetProductsResponseDto,
  IProduct,
} from "@/api/product/dto/get-products.dto";
import { GetState, RootState } from "../store";
import {
  ICreateProductBodyDto,
  ICreateProductResponseDto,
} from "@/api/product/dto/create-product.dto";
import { ICategory } from "@/api/category/dto/category.dto";
import {
  IGetCategoriesQueryDto,
  IGetCategoriesResponseDto,
} from "@/api/category/dto/get-categories.dto";
import { fetchGetCategories } from "../services/categoryApi";
import { IGetProductQueryDto } from "@/api/product/dto/get-product.dto";
import { IUpdateProductDto } from "@/api/product/dto/update-product.dto";
import enUS from "@/locales/en-us.locales";
import { IDeleteProductDto } from "@/api/product/dto/delete-product.dto";

export const getProductsAsync = createAsyncThunk(
  "admin/getProductsAsync",
  async (payload: IGetProductsQueryDto, { getState }) => {
    const states: RootState = getState();
    const tokens = {
      access: states.authReducer.accessToken,
    };
    const data = await fetchGetProducts(tokens, payload);
    return data;
  }
);

export const adminGetProductAsync = createAsyncThunk(
  "admin/getProductAsync",
  async (payload: IGetProductQueryDto, { getState }) => {
    const states: RootState = getState();
    const tokens = {
      access: states.authReducer.accessToken,
    };
    const data = await fetchGetProduct(tokens, payload);
    return data;
  }
);

export const createProductAsync = createAsyncThunk(
  "admin/createProductAsync",
  async (payload: ICreateProductBodyDto, { getState }) => {
    const states: RootState = getState();
    const tokens = {
      access: states.authReducer.accessToken,
    };
    const data = await fetchCreateProduct(tokens, payload);
    return data;
  }
);

export const adminUpdateProductAsync = createAsyncThunk(
  "admin/updateProductAsync",
  async (payload: IUpdateProductDto, { getState }) => {
    const states: RootState = getState();
    const tokens = {
      access: states.authReducer.accessToken,
    };
    const data = await fetchUpdateProduct(tokens, payload);
    return data;
  }
);

export const adminDeleteProductAsync = createAsyncThunk(
  "admin/deleteProductAsync",
  async (payload: IDeleteProductDto, { getState }) => {
    const states: RootState = getState();
    const tokens = {
      access: states.authReducer.accessToken,
    };
    const data = await fetchDeleteProduct(tokens, payload);
    return data;
  }
);

export const getCategoriesAsync = createAsyncThunk(
  "admin/adminGetCategoriesAsync",
  async (payload: IGetCategoriesQueryDto, { getState }) => {
    const states: RootState = getState();
    const tokens = {
      access: states.authReducer.accessToken,
    };
    const data = await fetchGetCategories(tokens, payload);
    return data;
  }
);

export enum AdminFormStatus {
  IDLE = "idle",
  LOADING = "loading",
}

export type AdminState = {
  formStatus: AdminFormStatus;
  categories: ICategory[] | null;
  products: IProduct[] | null;
};

const initialState = {
  formStatus: AdminFormStatus.IDLE,
  categories: null,
  products: null,
} as AdminState;

export const admin = createSlice({
  name: "admin",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(getProductsAsync.pending, (state) => {
        state.formStatus = AdminFormStatus.LOADING;
      })
      .addCase(getProductsAsync.fulfilled, (state, action) => {
        state.formStatus = AdminFormStatus.IDLE;
        const res = handleResponsePayload<IGetProductsResponseDto>(
          action.payload,
          {
            successMessage: enUS.ADMIN.MANAGE.PRODUCTS.GET_PRODUCTS_SUCCESS,
          }
        );
        if (!res) {
          return state;
        }
        state.products = res.data?.results;
      })
      .addCase(getProductsAsync.rejected, (state, action) => {
        state.formStatus = AdminFormStatus.IDLE;
      })
      .addCase(createProductAsync.pending, (state) => {
        state.formStatus = AdminFormStatus.LOADING;
      })
      .addCase(createProductAsync.fulfilled, (state, action) => {
        state.formStatus = AdminFormStatus.IDLE;
        const res = handleResponsePayload<IProduct>(action.payload);
        if (!res) {
          return state;
        }
        if (!state.products) {
          state.products = [];
        }
        state.products.push(res.data as IProduct);
        return state;
      })
      .addCase(createProductAsync.rejected, (state, action) => {
        state.formStatus = AdminFormStatus.IDLE;
      })
      .addCase(adminGetProductAsync.pending, (state) => {
        state.formStatus = AdminFormStatus.LOADING;
      })
      .addCase(adminGetProductAsync.fulfilled, (state, action) => {
        state.formStatus = AdminFormStatus.IDLE;
        const res = handleResponsePayload<IProduct>(action.payload, {
          notifySuccessMessage: false,
        });
        if (!res) {
          return state;
        }
        if (!state.products) {
          state.products = [];
        }
        state.products.push(res.data as IProduct);
        return state;
      })
      .addCase(adminGetProductAsync.rejected, (state, action) => {
        state.formStatus = AdminFormStatus.IDLE;
      })
      .addCase(adminUpdateProductAsync.pending, (state) => {
        state.formStatus = AdminFormStatus.LOADING;
      })
      .addCase(adminUpdateProductAsync.fulfilled, (state, action) => {
        state.formStatus = AdminFormStatus.IDLE;
        const res = handleResponsePayload<IProduct>(action.payload, {
          successMessage: enUS.ADMIN.MANAGE.PRODUCTS.UPDATE_PRODUCT_SUCCESS,
        });

        if (!res) {
          return state;
        }

        const updatedProduct = res.data as IProduct;
        const prevProduct = state.products?.find(
          (i) => i.id === updatedProduct.id
        );

        if (!prevProduct) {
          return state;
        }

        Object.assign(prevProduct, updatedProduct);
        return state;
      })
      .addCase(adminUpdateProductAsync.rejected, (state, action) => {
        state.formStatus = AdminFormStatus.IDLE;
      })
      .addCase(adminDeleteProductAsync.pending, (state) => {
        state.formStatus = AdminFormStatus.LOADING;
      })
      .addCase(adminDeleteProductAsync.fulfilled, (state, action) => {
        state.formStatus = AdminFormStatus.IDLE;
        const res = handleResponsePayload<IProduct>(action.payload, {
          successMessage: enUS.ADMIN.MANAGE.PRODUCTS.DELETE_PRODUCT_SUCCESS,
        });

        if (!res) {
          return state;
        }

        const deletedProduct = res.data as IProduct;
        state.products = state.products?.filter(
          (i) => i.id !== deletedProduct.id
        );

        return state;
      })
      .addCase(adminDeleteProductAsync.rejected, (state, action) => {
        state.formStatus = AdminFormStatus.IDLE;
      })
      .addCase(getCategoriesAsync.pending, (state) => {
        state.formStatus = AdminFormStatus.LOADING;
      })
      .addCase(getCategoriesAsync.fulfilled, (state, action) => {
        state.formStatus = AdminFormStatus.IDLE;
        const res = handleResponsePayload<IGetCategoriesResponseDto>(
          action.payload,
          {
            notifySuccessMessage: false,
          }
        );
        if (!res) {
          return state;
        }

        state.categories = res.data?.results;
      })
      .addCase(getCategoriesAsync.rejected, (state, action) => {
        state.formStatus = AdminFormStatus.IDLE;
      });
  },
});

export const { reset } = admin.actions;
export default admin.reducer;

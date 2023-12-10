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
import {
  fetchCreateCategory,
  fetchDeleteCategory,
  fetchGetCategories,
  fetchGetCategory,
  fetchUpdateCategory,
} from "../services/categoryApi";
import { IGetProductQueryDto } from "@/api/product/dto/get-product.dto";
import { IUpdateProductDto } from "@/api/product/dto/update-product.dto";
import enUS from "@/locales/en-us.locales";
import { IDeleteProductDto } from "@/api/product/dto/delete-product.dto";
import { ICreateCategoryBodyDto } from "@/api/category/dto/create-category.dto";
import { IGetCategoryQueryDto } from "@/api/category/dto/get-category.dto";
import { IUpdateCategoryDto } from "@/api/category/dto/update-category.dto";
import { IDeleteCategoryQueryDto } from "@/api/category/dto/delete-category.dto";

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

export const createCategoryAsync = createAsyncThunk(
  "admin/createCategoryAsync",
  async (payload: ICreateCategoryBodyDto, { getState }) => {
    const states: RootState = getState();
    const tokens = {
      access: states.authReducer.accessToken,
    };
    const data = await fetchCreateCategory(tokens, payload);
    return data;
  }
);

export const getCategoryAsync = createAsyncThunk(
  "admin/getCategoryAsync",
  async (payload: IGetCategoryQueryDto, { getState }) => {
    const states: RootState = getState();
    const tokens = {
      access: states.authReducer.accessToken,
    };
    const data = await fetchGetCategory(tokens, payload);
    return data;
  }
);

export const updateCategoryAsync = createAsyncThunk(
  "admin/updateCategoryAsync",
  async (payload: IUpdateCategoryDto, { getState }) => {
    const states: RootState = getState();
    const tokens = {
      access: states.authReducer.accessToken,
    };
    const data = await fetchUpdateCategory(tokens, payload);
    return data;
  }
);

export const deleteCategoryAsync = createAsyncThunk(
  "admin/deleteCategoryAsync",
  async (payload: IDeleteCategoryQueryDto, { getState }) => {
    const states: RootState = getState();
    const tokens = {
      access: states.authReducer.accessToken,
    };
    const data = await fetchDeleteCategory(tokens, payload);
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
        return state;
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
        return state;
      })
      .addCase(createProductAsync.pending, (state) => {
        state.formStatus = AdminFormStatus.LOADING;
        return state;
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
        return state;
      })
      .addCase(adminGetProductAsync.pending, (state) => {
        state.formStatus = AdminFormStatus.LOADING;
        return state;
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
        return state;
      })
      .addCase(adminUpdateProductAsync.pending, (state) => {
        state.formStatus = AdminFormStatus.LOADING;
        return state;
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
        return state;
      })
      .addCase(adminDeleteProductAsync.pending, (state) => {
        state.formStatus = AdminFormStatus.LOADING;
        return state;
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
        return state;
      })
      .addCase(getCategoriesAsync.pending, (state) => {
        state.formStatus = AdminFormStatus.LOADING;
        return state;
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
        return state;
      })
      .addCase(createCategoryAsync.pending, (state) => {
        state.formStatus = AdminFormStatus.LOADING;
        return state;
      })
      .addCase(createCategoryAsync.fulfilled, (state, action) => {
        state.formStatus = AdminFormStatus.IDLE;
        const res = handleResponsePayload<ICategory>(action.payload, {
          successMessage: enUS.ADMIN.MANAGE.CATEGORIES.CREATE_CATEGORY_SUCCESS,
        });
        if (!res) {
          return state;
        }
        if (!state.categories) {
          state.categories = [];
        }
        state.categories.push(res.data as ICategory);
        return state;
      })
      .addCase(createCategoryAsync.rejected, (state, action) => {
        state.formStatus = AdminFormStatus.IDLE;
        return state;
      })
      .addCase(updateCategoryAsync.pending, (state) => {
        state.formStatus = AdminFormStatus.LOADING;
        return state;
      })
      .addCase(updateCategoryAsync.fulfilled, (state, action) => {
        state.formStatus = AdminFormStatus.IDLE;
        const res = handleResponsePayload<ICategory>(action.payload, {
          successMessage: enUS.ADMIN.MANAGE.CATEGORIES.UPDATE_CATEGORY_SUCCESS,
        });
        if (!res) {
          return state;
        }
        if (!state.categories) {
          state.categories = [];
        }
        const updatedCategory = res.data as ICategory;
        const prevCategory = state.categories.find(
          (i) => i.id === updatedCategory.id
        );

        if (!prevCategory) {
          return state;
        }

        Object.assign(prevCategory, updatedCategory);
        return state;
      })
      .addCase(updateCategoryAsync.rejected, (state, action) => {
        state.formStatus = AdminFormStatus.IDLE;
        return state;
      })
      .addCase(deleteCategoryAsync.pending, (state) => {
        state.formStatus = AdminFormStatus.LOADING;
        return state;
      })
      .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
        state.formStatus = AdminFormStatus.IDLE;
        const res = handleResponsePayload<ICategory>(action.payload, {
          successMessage: enUS.ADMIN.MANAGE.CATEGORIES.DELETE_CATEGORY_SUCCESS,
        });
        if (!res) {
          return state;
        }
        if (!state.categories) {
          state.categories = [];
        }
        const deletedCategory = res.data as ICategory;
        state.categories = state.categories.filter(
          (i) => i.id !== deletedCategory.id
        );
        return state;
      })
      .addCase(deleteCategoryAsync.rejected, (state, action) => {
        state.formStatus = AdminFormStatus.IDLE;
        return state;
      });
  },
});

export const { reset } = admin.actions;
export default admin.reducer;

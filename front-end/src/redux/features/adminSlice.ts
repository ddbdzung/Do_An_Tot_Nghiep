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
import {
  fetchGetTransactions,
  fetchUpdateTransaction,
} from "../services/checkoutApi";
import { GetTransactionsQueryDto } from "@/api/transactions/dto/get-transactions.dto";
import {
  ITransaction,
  TransactionDto,
} from "@/api/transactions/dto/transaction.dto";
import _ from "lodash";
import { plainToInstance } from "class-transformer";
import {
  fetchGetProgresses,
  fetchUpdateProgress,
} from "../services/progressApi";
import { IProgress } from "@/api/progress/dto/progress.dto";
import { IUpdateProgressDto } from "@/api/progress/dto/update-progress.dto";

export const updateProgressAsync = createAsyncThunk(
  "admin/updateProgress",
  async (payload: IUpdateProgressDto, { getState }) => {
    const states: RootState = getState();
    const tokens = {
      access: states.authReducer.accessToken,
    };

    const data = await fetchUpdateProgress(tokens, payload);
    return data;
  }
);

export const getProgressesAsync = createAsyncThunk(
  "admin/getProgresses",
  async (query: IGetProgressesQueryDto, { getState }) => {
    const states: RootState = getState();
    const tokens = {
      access: states.authReducer.accessToken,
    };

    const data = await fetchGetProgresses(tokens, query);
    return data;
  }
);

export const getTransactionsAsync = createAsyncThunk(
  "admin/getTransactions",
  async (payload: GetTransactionsQueryDto, { getState }) => {
    const states: RootState = getState();
    const tokens = {
      access: states.authReducer.accessToken,
    };
    const data = await fetchGetTransactions(tokens, payload);
    return data;
  }
);

export const updateTransactionAsync = createAsyncThunk(
  "admin/updateTransaction",
  async (payload: TransactionDto, { getState }) => {
    const states: RootState = getState();
    const tokens = {
      access: states.authReducer.accessToken,
    };
    const data = await fetchUpdateTransaction(tokens, payload);
    return data;
  }
);

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
  transactions: ITransaction[] | null;
  progresses: IProgress[] | null;
};

const initialState = {
  formStatus: AdminFormStatus.IDLE,
  categories: null,
  products: null,
  transactions: null,
  progresses: null,
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
      })
      .addCase(getTransactionsAsync.pending, (state) => {
        state.formStatus = AdminFormStatus.LOADING;

        return state;
      })
      .addCase(getTransactionsAsync.fulfilled, (state, action) => {
        state.formStatus = AdminFormStatus.IDLE;
        const res = handleResponsePayload<ITransaction>(action.payload, {
          successMessage:
            enUS.ADMIN.MANAGE.TRANSACTIONS.GET_TRANSACTIONS_SUCCESS,
        });
        if (_.isEmpty(res)) {
          return state;
        }
        if (_.isEmpty(state.transactions)) {
          state.transactions = [];
        }
        state.transactions = res.data?.results as ITransaction[];
        return state;
      })
      .addCase(getTransactionsAsync.rejected, (state, action) => {
        state.formStatus = AdminFormStatus.IDLE;
        return state;
      })
      .addCase(updateTransactionAsync.pending, (state) => {
        state.formStatus = AdminFormStatus.LOADING;
        return state;
      })
      .addCase(updateTransactionAsync.fulfilled, (state, action) => {
        state.formStatus = AdminFormStatus.IDLE;
        const res = handleResponsePayload<ITransaction>(action.payload, {
          successMessage:
            enUS.ADMIN.MANAGE.TRANSACTIONS.UPDATE_TRANSACTION_SUCCESS,
        });
        if (_.isEmpty(res)) {
          return state;
        }

        if (!state.transactions) {
          state.transactions = [res.data];
          return state;
        }

        const prevTransactions = _.cloneDeep(state.transactions);
        const updatedTransaction = prevTransactions?.findIndex(
          (i) => i.id === res.data?.id
        );
        if (updatedTransaction === -1) {
          return state;
        }
        prevTransactions[updatedTransaction] = res.data as ITransaction;
        state.transactions = prevTransactions;
        return state;
      })
      .addCase(updateTransactionAsync.rejected, (state, action) => {
        state.formStatus = AdminFormStatus.IDLE;
        return state;
      })
      .addCase(getProgressesAsync.pending, (state) => {
        state.formStatus = AdminFormStatus.LOADING;
        return state;
      })
      .addCase(getProgressesAsync.fulfilled, (state, action) => {
        console.log(
          "🚀 ~ file: adminSlice.ts:528 ~ .addCase ~ action:",
          action
        );
        state.formStatus = AdminFormStatus.IDLE;
        const res = handleResponsePayload<IProgress>(action.payload, {
          successMessage: enUS.ADMIN.MANAGE.PROGRESSES.GET_PROGRESSES_SUCCESS,
        });
        if (_.isEmpty(res)) {
          return state;
        }
        if (_.isEmpty(state.progresses)) {
          state.progresses = [];
        }
        state.progresses = res.data as IProgress[];
        return state;
      })
      .addCase(getProgressesAsync.rejected, (state, action) => {
        state.formStatus = AdminFormStatus.IDLE;
        return state;
      })
      .addCase(updateProgressAsync.pending, (state) => {
        state.formStatus = AdminFormStatus.LOADING;
        return state;
      })
      .addCase(updateProgressAsync.fulfilled, (state, action) => {
        state.formStatus = AdminFormStatus.IDLE;
        const res = handleResponsePayload<IProgress>(action.payload, {
          successMessage: enUS.ADMIN.MANAGE.PROGRESSES.UPDATE_PROGRESS_SUCCESS,
        });
        if (_.isEmpty(res)) {
          return state;
        }

        if (!state.progresses) {
          state.progresses = [res.data];
          return state;
        }

        const prevProgresses = _.cloneDeep(state.progresses);
        const updatedProgress = prevProgresses?.findIndex(
          (i) => i.id === res.data?.id
        );
        if (updatedProgress === -1) {
          return state;
        }
        prevProgresses[updatedProgress] = res.data as IProgress;
        state.progresses = prevProgresses;
        return state;
      })
      .addCase(updateProgressAsync.rejected, (state, action) => {
        console.error("updateProgressAsync action", action);
        state.formStatus = AdminFormStatus.IDLE;
        return state;
      });
  },
});

export const { reset } = admin.actions;
export default admin.reducer;

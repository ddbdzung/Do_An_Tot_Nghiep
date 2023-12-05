import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { fetchGetProducts, fetchSearchProducts } from "../services/productApi";
import { ISearchProductsDto } from "@/api/product/dto/search-products.dto";
import {
  handleResponsePayload,
  IResponsePayload,
} from "@/http-service/response-handler";

export const searchProductsAsync = createAsyncThunk(
  "products/searchProductsAsync",
  async (payload: ISearchProductsDto, { getState }) => {
    const states: RootState = getState();
    const tokens = {
      access: states.authReducer.accessToken,
    };
    const data = await fetchSearchProducts(tokens, payload);
    return data;
  }
);

export type ProductState = {
  products: any[];
  formStatus: "idle" | "loading" | "succeeded" | "failed";
};

const initialState = {
  products: [],
  formStatus: "idle",
} as ProductState;

export const productReducer = createSlice({
  name: "products",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProductsAsync.pending, (state) => {
        state.formStatus = "loading";
        return state;
      })
      .addCase(
        searchProductsAsync.fulfilled,
        (state, action: PayloadAction<any>) => {
          const res = handleResponsePayload<IResponsePayload<any>>(
            action.payload,
            {
              notifySuccessMessage: false,
            }
          );
          if (!res) return state;

          if (!state.products) state.products = [];
          console.log("res", res);
          state.products = res.data?.results;
          state.formStatus = "idle";

          return state;
        }
      )
      .addCase(searchProductsAsync.rejected, (state) => {
        state.formStatus = "idle";
        return state;
      });
  },
});

export const { reset } = productReducer.actions;
export default productReducer.reducer;

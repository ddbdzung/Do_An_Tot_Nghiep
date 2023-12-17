import { ICart } from "@/interfaces/ICart";
import { loadState, removeState, saveState } from "@/utils/localStorage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAddToCart,
  fetchGetCart,
  fetchRemoveProductFromCart,
} from "../services/cartApi";
import {
  IAddToCartBodyDto,
  IAddToCartResponseDto,
} from "@/api/cart/dto/IAddToCart.dto";
import {
  handleResponsePayload,
  IResponsePayload,
} from "@/http-service/response-handler";
import { IGetCartResponseDto } from "@/api/cart/dto/IGetCart.dto";

export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async (payload: IAddToCartBodyDto, { getState }) => {
    console.log("payload", payload);
    const states: RootState = getState();
    const tokens = {
      access: states.authReducer.accessToken,
    };
    const data = await fetchAddToCart(tokens, payload);
    return data;
  }
);

export const getCartAsync = createAsyncThunk(
  "cart/getCartAsync",
  async (id: string, { getState }) => {
    const states: RootState = getState();
    const tokens = {
      access: states.authReducer.accessToken,
    };
    const data = await fetchGetCart(tokens, id);
    return data;
  }
);

export const removeProductFromCartAsync = createAsyncThunk(
  "cart/removeProductFromCartAsync",
  async (id: string, { getState }) => {
    const states: RootState = getState();
    const tokens = {
      access: states.authReducer.accessToken,
    };
    const data = await fetchRemoveProductFromCart(tokens, id);
    return data;
  }
);

enum FormStatus {
  IDLE = "idle",
  LOADING = "loading",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
}

const initialState = {
  id: loadState<ICart>("cart")?.id || "",
  items: loadState<ICart>("cart")?.items || [],
  formStatus: FormStatus.IDLE,
} as ICart & { formStatus: FormStatus };

export const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    reset: () => initialState,
    clearCart: (state) => {
      state.id = "";
      state.items = [];

      removeState("cart");
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartAsync.pending, (state, action) => {
        state.formStatus = FormStatus.LOADING;
        return state;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        const res = handleResponsePayload<
          IResponsePayload<IAddToCartResponseDto>
        >(action.payload, {
          successMessage: "Add to cart successfully",
          errorMessage: action.payload.message,
        });
        if (!res) {
          state.formStatus = FormStatus.IDLE;
          return state;
        }
        state.items = res.data.products;
        state.formStatus = FormStatus.SUCCEEDED;
        state.id = res.data._id;

        const currentCart = loadState<ICart>("cart");
        if (!currentCart) {
          saveState("cart", {
            id: res.data._id,
            items: [],
          });
        }
        if (
          currentCart?.items?.length === 0 ||
          currentCart?.items.findIndex((i) => i.product?._id !== res.data?._id)
        ) {
          saveState("cart", {
            id: res.data?._id,
            items: res.data?.products,
          });
          return state;
        }

        saveState("cart", {
          id: res.data._id,
          items: currentCart.items?.push(res.data.products) || currentCart,
        });
        return state;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        return state;
      })
      .addCase(getCartAsync.pending, (state, action) => {
        state.formStatus = FormStatus.LOADING;
        return state;
      })
      .addCase(getCartAsync.fulfilled, (state, action) => {
        const res = handleResponsePayload<
          IResponsePayload<IGetCartResponseDto>
        >(action.payload, {
          notifySuccessMessage: false,
        });
        if (!res) {
          state.formStatus = FormStatus.IDLE;
          return state;
        }
        state.items = res.data?.products || [];
        state.formStatus = FormStatus.IDLE;
        state.id = res.data?._id || "";
        saveState("cart", {
          id: res.data?._id,
          items: res.data?.products,
        });
        return state;
      })
      .addCase(getCartAsync.rejected, (state, action) => {
        state.formStatus = FormStatus.IDLE;
        return state;
      })
      .addCase(removeProductFromCartAsync.pending, (state, action) => {
        state.formStatus = FormStatus.LOADING;
        return state;
      })
      .addCase(removeProductFromCartAsync.fulfilled, (state, action) => {
        const res = handleResponsePayload<
          IResponsePayload<IGetCartResponseDto>
        >(action.payload, {
          notifySuccessMessage: false,
        });
        if (!res) {
          state.formStatus = FormStatus.IDLE;
          return state;
        }
        state.items = res.data.products;
        state.formStatus = FormStatus.SUCCEEDED;
        state.id = res.data._id;
        saveState("cart", {
          id: res.data._id,
          items: res.data.products,
        });
        return state;
      })
      .addCase(removeProductFromCartAsync.rejected, (state, action) => {
        state.formStatus = FormStatus.IDLE;
        return state;
      });
  },
});

export const { reset, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

import { ICreateTransactionDto } from "@/api/checkout/dto/create-transaction.dto";
import { loadState, removeState } from "@/utils/localStorage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  fetchCreateTransaction,
  fetchGetTransactionOfMe,
} from "../services/checkoutApi";
import { handleResponsePayload } from "@/http-service/response-handler";

export const createTransactionAsync = createAsyncThunk(
  "checkout/createTransaction",
  async (payload: ICreateTransactionDto, { getState }) => {
    const states: RootState = getState();
    const tokens = {
      access: states.authReducer.accessToken,
    };
    const data = await fetchCreateTransaction(tokens, payload);
    return data;
  }
);

export const getTransactionsOfMeAsync = createAsyncThunk(
  "checkout/getTransactionsOfMe",
  async (_: any, { getState }) => {
    const states: RootState = getState();
    const tokens = {
      access: states.authReducer.accessToken,
    };
    const data = await fetchGetTransactionOfMe(tokens);
    return data;
  }
);

type CheckoutState = {
  email: string;
  address: string;
  phoneNumber: string;
  fullname: string;
  paymentMethod: PaymentMethod;
};

export enum PaymentMethod {
  COD = "cod",
  MOMO = "momo",
  PAYPAL = "paypal",
  INTERNET_BANKING = "Internet-banking",
}

const initialState = {
  email: "",
  fullname: "",

  address: loadState("address") || "",
  phoneNumber: loadState("phoneNumber") || "",
  paymentMethod: PaymentMethod.COD,
} as CheckoutState;

export const checkoutSlice = createSlice({
  name: "checkoutSlice",
  initialState,
  reducers: {
    reset: () => initialState,
    setEmail: (state, action: PayloadAction<string>) => ({
      ...state,
      email: action.payload,
    }),
    setAddress: (state, action: PayloadAction<string>) => ({
      ...state,
      address: action.payload,
    }),
    setPhoneNumber: (state, action: PayloadAction<string>) => ({
      ...state,
      phoneNumber: action.payload,
    }),
    setFullname: (state, action: PayloadAction<string>) => ({
      ...state,
      fullname: action.payload,
    }),
    setPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => ({
      ...state,
      paymentMethod: action.payload,
    }),
    clearCheckout: (state) => {
      state.email = "";
      state.address = "";
      state.phoneNumber = "";
      state.fullname = "";
      state.paymentMethod = PaymentMethod.COD;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTransactionAsync.pending, (state) => {
        return state;
      })
      .addCase(
        createTransactionAsync.fulfilled,
        (state, action: PayloadAction<ICreateTransactionDto>) => {
          const res = handleResponsePayload(action.payload, {
            notifyErrorMessage: true,
            notifySuccessMessage: true,
          });
          if (!res) return state;

          return state;
        }
      )
      .addCase(createTransactionAsync.rejected, (state, action) => {
        console.log("action", action);
        return state;
      })
      .addCase(getTransactionsOfMeAsync.pending, (state) => {
        return state;
      })
      .addCase(getTransactionsOfMeAsync.fulfilled, (state, action) => {
        return state;
      })
      .addCase(getTransactionsOfMeAsync.rejected, (state, action) => {
        return state;
      });
  },
});

export const {
  reset,
  setAddress,
  setEmail,
  setPhoneNumber,
  setFullname,
  setPaymentMethod,
  clearCheckout,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;

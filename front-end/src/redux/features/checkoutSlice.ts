import { loadState } from "@/utils/localStorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CheckoutState = {
  email: string;
  address: string;
  phoneNumber: string;
  fullname: string;
  paymentMethod: PaymentMethod;
};

enum PaymentMethod {
  COD = "cod",
  MOMO = "momo",
  INTERNET_BANKING = "Internet-banking",
  WALLET = "Wallet",
}

const initialState = {
  email: "",
  address: "",
  phoneNumber: "",
  fullname: "",
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
  },
});

export const {
  reset,
  setAddress,
  setEmail,
  setPhoneNumber,
  setFullname,
  setPaymentMethod,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;

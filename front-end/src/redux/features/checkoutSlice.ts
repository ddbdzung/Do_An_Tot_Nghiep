import { loadState } from "@/utils/localStorage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CheckoutState = {
  email: string;
  address: string;
  phoneNumber: string;
  fullname: string;
};

const initialState = {
  email: "",
  address: "",
  phoneNumber: "",
  fullname: "",
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
  },
});

export const { reset, setAddress, setEmail, setPhoneNumber, setFullname } =
  checkoutSlice.actions;
export default checkoutSlice.reducer;

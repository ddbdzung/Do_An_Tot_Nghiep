import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counterSlice";
import authReducer from "./features/authSlice";
import adminReducer from "./features/adminSlice";
import productReducer from "./features/productSlice";
import userReducer from "./features/userSlice";
import cartReducer from "./features/cartSlice";

export const store = configureStore({
  reducer: {
    counterReducer,
    authReducer,
    adminReducer,
    productReducer,
    userReducer,
    cartReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

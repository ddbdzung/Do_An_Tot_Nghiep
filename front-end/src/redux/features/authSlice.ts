import { ISignUpBodyDto, ISignUpResponseDto } from "@/api/auth/dto/sign-up.dto";
import { SIGN_IN, SIGN_OUT, SIGN_UP } from "@/api/auth/endpoints";
import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  Action,
} from "@reduxjs/toolkit";
import {
  fetchSignIn,
  fetchSignUp,
  fetchToggleFavouriteProduct,
} from "../services/authApi";
import { handleResponsePayload } from "@/http-service/response-handler";
import { notifyError } from "@/utils/notify";
import { HttpMessage } from "@/http-service/http-message";
import { loadState, removeState, saveState } from "@/utils/localStorage";
import { ISignInResponseDto } from "@/api/auth/dto/sign-in.dto";
import { RootState } from "../store";

export const signUpAsync = createAsyncThunk(
  "auth/signUpAsync",
  async (payload: ISignUpBodyDto, { getState }) => {
    const data = await fetchSignUp(payload);
    return data;
  }
);

export const signInAsync = createAsyncThunk(
  "auth/signInAsync",
  async (payload: ISignInBodyDto, { getState }) => {
    const data = await fetchSignIn(payload);
    return data;
  }
);

// export const signOutAsync = createAsyncThunk(
//   SIGN_OUT,
//   async (payload: )
// )

export const toggleFavouriteProductAsync = createAsyncThunk(
  "auth/toggleFavouriteProductAsync",
  async (payload: string, { getState }) => {
    const states: RootState = getState();
    const tokens = {
      access: states.authReducer.accessToken,
    };
    const data = await fetchToggleFavouriteProduct(tokens, payload);
    return data;
  }
);

export enum AuthFormStatus {
  IDLE = "idle",
  LOADING = "loading",
}

export type AuthState = {
  formStatus: AuthFormStatus;
  accessToken: string | null | undefined;
  fullname: string | null | undefined;
  email: string | null | undefined;
  permissions: string[];
  uid: string | null | undefined;
  favouriteProducts: string[];
};

const initialState = {
  accessToken: loadState("accessToken") || null,
  fullname: loadState("fullname") || null,
  email: loadState("email") || null,
  permissions: loadState("permissions") || [],
  formStatus: AuthFormStatus.IDLE,
  favouriteProducts: loadState("favouriteProducts") || [],
  uid: loadState("uid") || null,
} as AuthState;

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    updateFullname: (state, action: PayloadAction<string>) => {
      console.log("action.payload", action.payload);
      state.fullname = action.payload;
      saveState("fullname", action.payload);
      return state;
    },
    signOut: (state) => {
      state.accessToken = null;
      state.email = null;
      state.fullname = null;
      state.permissions = [];
      state.favouriteProducts = [];
      state.uid = null;

      removeState("accessToken");
      removeState("permissions");
      removeState("email");
      removeState("fullname");
      removeState("favouriteProducts");
      removeState("dateOfBirth");
      removeState("gender");
      removeState("address");
      removeState("phoneNumber");
      removeState("uid");
      return state;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(signUpAsync.pending, (state) => {
        state.formStatus = AuthFormStatus.LOADING;
        return state;
      })
      .addCase(signUpAsync.fulfilled, (state, action) => {
        state.formStatus = AuthFormStatus.IDLE;
        const res = handleResponsePayload<ISignUpResponseDto>(action.payload);
        if (!res) {
          return state;
        }

        state.accessToken = res.data?.tokens.access.token;
        state.permissions = res.data?.user.permissions;
        state.email = res.data?.user.email;
        state.fullname = res.data?.user.name;
        state.favouriteProducts = res.data?.user.favouriteProducts;
        state.uid = res.data?.user.id;

        saveState("accessToken", res.data?.tokens.access.token);
        saveState("permissions", res.data?.user.permissions);
        saveState("email", res.data?.user.email);
        saveState("fullname", res.data?.user.name);
        saveState("favouriteProducts", res.data?.user.favouriteProducts);
        saveState("uid", res.data?.user._id);

        return state;
      })
      .addCase(signUpAsync.rejected, (state, action) => {
        state.formStatus = AuthFormStatus.IDLE;
        notifyError(HttpMessage.INTERNAL_SERVER_ERROR);
        return state;
      })
      .addCase(signInAsync.pending, (state) => {
        state.formStatus = AuthFormStatus.LOADING;
        return state;
      })
      .addCase(signInAsync.fulfilled, (state, action) => {
        const res = handleResponsePayload<ISignInResponseDto>(action.payload);
        state.formStatus = AuthFormStatus.IDLE;
        if (!res) {
          return state;
        }

        state.accessToken = res.data?.tokens.access.token;
        state.permissions = res.data?.user.permissions;
        state.email = res.data?.user.email;
        state.fullname = res.data?.user.name;
        state.favouriteProducts = res.data?.user.favouriteProducts;
        state.uid = res.data?.user._id;

        saveState("accessToken", res.data?.tokens.access.token);
        saveState("permissions", res.data?.user.permissions);
        saveState("email", res.data?.user.email);
        saveState("fullname", res.data?.user.name);
        saveState("favouriteProducts", res.data?.user.favouriteProducts);
        saveState("uid", res.data?.user._id);

        return state;
      })
      .addCase(signInAsync.rejected, (state, action) => {
        state.formStatus = AuthFormStatus.IDLE;
        notifyError(HttpMessage.INTERNAL_SERVER_ERROR);
        return state;
      })
      .addCase(toggleFavouriteProductAsync.pending, (state) => {
        return state;
      })
      .addCase(toggleFavouriteProductAsync.fulfilled, (state, action) => {
        const res = handleResponsePayload<any>(action.payload);
        if (!res) {
          return state;
        }

        state.favouriteProducts = res.data?.favouriteProducts;
        saveState("favouriteProducts", res.data?.favouriteProducts);
        return state;
      })
      .addCase(toggleFavouriteProductAsync.rejected, (state, action) => {
        return state;
      });
  },
});

export const { reset, signOut, updateFullname } = auth.actions;
export default auth.reducer;

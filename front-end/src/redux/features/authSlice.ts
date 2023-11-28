import { ISignUpBodyDto, ISignUpResponseDto } from "@/api/auth/dto/sign-up.dto";
import { SIGN_IN, SIGN_OUT, SIGN_UP } from "@/api/auth/endpoints";
import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  Action,
} from "@reduxjs/toolkit";
import { fetchSignIn, fetchSignUp } from "../services/authApi";
import { handleResponsePayload } from "@/http-service/response-handler";
import { notifyError } from "@/utils/notify";
import { HttpMessage } from "@/http-service/http-message";
import { loadState, saveState } from "@/utils/localStorage";
import { ISignInResponseDto } from "@/api/auth/dto/sign-in.dto";

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
};

const initialState = {
  accessToken: loadState("accessToken") || null,
  fullname: loadState("fullname") || null,
  email: loadState("email") || null,
  permissions: loadState("permissions") || [],
  formStatus: AuthFormStatus.IDLE,
} as AuthState;

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    signOut: (state) => {
      state.accessToken = null;
      state.email = null;
      state.fullname = null;
      state.permissions = [];

      saveState("accessToken", null);
      saveState("permissions", []);
      saveState("email", null);
      saveState("fullname", null);
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

        saveState("accessToken", res.data?.tokens.access.token);
        saveState("permissions", res.data?.user.permissions);
        saveState("email", res.data?.user.email);
        saveState("fullname", res.data?.user.name);

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

        saveState("accessToken", res.data?.tokens.access.token);
        saveState("permissions", res.data?.user.permissions);
        saveState("email", res.data?.user.email);
        saveState("fullname", res.data?.user.name);

        return state;
      })
      .addCase(signInAsync.rejected, (state, action) => {
        state.formStatus = AuthFormStatus.IDLE;
        notifyError(HttpMessage.INTERNAL_SERVER_ERROR);
        return state;
      });
  },
});

export const { reset, signOut } = auth.actions;
export default auth.reducer;

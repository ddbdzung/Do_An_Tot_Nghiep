import { ISignUpBodyDto, ISignUpResponseDto } from "@/api/auth/dto/SignUp.dto";
import { SIGN_UP } from "@/api/auth/endpoints";
import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  Action,
} from "@reduxjs/toolkit";
import { fetchSignUp } from "../services/authApi";
import { handleResponsePayload } from "@/http-service/response-handler";
import { notifyError } from "@/utils/notify";
import { HttpMessage } from "@/http-service/http-message";
import { loadState, saveState } from "@/utils/localStorage";

export const signUpAsync = createAsyncThunk(
  SIGN_UP,
  async (payload: ISignUpBodyDto, { getState }) => {
    const data = await fetchSignUp(payload);
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
  },
  extraReducers(builder) {
    builder
      .addCase(signUpAsync.pending, (state) => {
        state.formStatus = AuthFormStatus.LOADING;
        return state;
      })
      .addCase(signUpAsync.fulfilled, (state, action) => {
        const res = handleResponsePayload<ISignUpResponseDto>(action.payload);
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
      .addCase(signUpAsync.rejected, (state, action) => {
        state.formStatus = AuthFormStatus.IDLE;
        notifyError(HttpMessage.INTERNAL_SERVER_ERROR);
        return state;
      });
  },
});

export const { reset } = auth.actions;
export default auth.reducer;

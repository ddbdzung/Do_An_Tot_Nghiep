import { loadState, saveState } from "@/utils/localStorage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchGetMe, fetchUpdateMe } from "../services/userApi";
import {
  handleResponsePayload,
  IResponsePayload,
} from "@/http-service/response-handler";
import { IGetMeResponseDto } from "@/api/user/dto/get-me.dto";
import {
  IUpdateMeBodyDto,
  IUpdateMeResponseDto,
} from "@/api/user/dto/update-me.dto";

export const getMeAsync = createAsyncThunk(
  "users/getMeAsync",
  async (payload = null, { getState }) => {
    const state = getState();
    const tokens = {
      access: state.authReducer.accessToken,
    };
    const data = await fetchGetMe(tokens);
    return data;
  }
);

export const updateMeAsync = createAsyncThunk(
  "users/updateMeAsync",
  async (payload: IUpdateMeBodyDto, { getState }) => {
    const state = getState();
    const tokens = {
      access: state.authReducer.accessToken,
    };
    const data = await fetchUpdateMe(tokens, payload);
    return data;
  }
);

type UserState = {
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  gender: string;
  fullname: string;
};

const initialState = {
  dateOfBirth: loadState("dateOfBirth") || "",
  address: loadState("address") || "",
  phoneNumber: loadState("phoneNumber") || "",
  gender: loadState("gender") || "",
  fullname: loadState("gender") || "",
} as UserState;

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMeAsync.pending, (state) => {
        return state;
      })
      .addCase(
        getMeAsync.fulfilled,
        (state, action: PayloadAction<IGetMeResponseDto>) => {
          const res = handleResponsePayload<
            IResponsePayload<IGetMeResponseDto>
          >(action.payload, {
            notifySuccessMessage: false,
          });
          if (!res) return state;

          const data = res?.data;

          state.dateOfBirth = data?.dateOfBirth;
          state.address = data?.address;
          state.phoneNumber = data?.phoneNumber;
          state.gender = data?.gender;
          state.fullname = data?.fullname;
          saveState("dateOfBirth", data?.dateOfBirth);
          saveState("address", data?.address);
          saveState("phoneNumber", data?.phoneNumber);
          saveState("gender", data?.gender);
          saveState("fullname", data?.fullname);
          return state;
        }
      )
      .addCase(getMeAsync.rejected, (state, action) => {
        return state;
      })
      .addCase(updateMeAsync.pending, (state) => {
        return state;
      })
      .addCase(
        updateMeAsync.fulfilled,
        (state, action: PayloadAction<IUpdateMeResponseDto>) => {
          const res = handleResponsePayload<
            IResponsePayload<IUpdateMeResponseDto>
          >(action.payload);

          if (!res) return state;

          const data = res?.data;
          state.dateOfBirth = data?.dateOfBirth;
          state.address = data?.address;
          state.phoneNumber = data?.phoneNumber;
          state.gender = data?.gender;
          state.fullname = data?.fullname;
          saveState("dateOfBirth", data?.dateOfBirth);
          saveState("address", data?.address);
          saveState("phoneNumber", data?.phoneNumber);
          saveState("gender", data?.gender);
          saveState("fullname", data?.fullname);
          return state;
        }
      )
      .addCase(updateMeAsync.rejected, (state) => {
        return state;
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;

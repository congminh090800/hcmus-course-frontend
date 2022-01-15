import endpoints from "~/constants/endpoints";
import http from "~/utils/http";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const updateAccessToken = createAsyncThunk(
  "auth/UPDATE_ACCESS_TOKEN",
  async (loginForm) => {
    const result = await http.post(endpoints.signIn, loginForm);
    return result.data;
  }
);
export const auth = createSlice({
  name: "auth",
  initialState: {
    accessToken: "",
    refreshToken: "",
    expiredAt: null,
    accessExpiredAt: null,
    loading: false,
    user: {},
  },
  reducers: {
    DELETE_ACCESS_TOKEN: (state) => {
      state.accessToken = "";
      state.refreshToken = "";
      state.expiredAt = null;
      state.accessExpiredAt = null;
      state.user = {};
    },
    REFRESH_ACCESS_TOKEN: (state, { payload }) => {
      state.accessToken = payload;
      state.user.accessToken = payload;
      state.accessExpiredAt = Date.now() + 43100000;
    },
    UPDATE_GOOGLE_ACCOUNT: (state, { payload }) => {
      state.accessToken = payload.accessToken;
      state.expiredAt = payload.expiredAt;
      state.user = payload.user;
    },
    UPDATE_USER_AVATAR: (state, { payload }) => {
      state.user.avatar = payload;
    },
    UPDATE_USER_INFO: (state, { payload }) => {
      const newUser = {
        ...state.user,
        name: payload.name,
        birthDate: payload.birthDate,
        gender: payload.gender,
        phone: payload.phone,
      };
      state.user = newUser;
    },
    SET_USER_STUDENT_ID: (state, { payload }) => {
      const newUser = { ...state.user, studentId: payload };
      state.user = newUser;
    },
    UPDATE_USER_NOTIFICATIONS: (state, { payload }) => {
      const newUser = { ...state.user, notifications: payload };
      state.user = newUser;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(updateAccessToken.fulfilled, (state, { payload }) => {
      state.accessToken = payload.accessToken;
      state.user = payload.user;
      state.refreshToken = payload.refreshToken;
      state.expiredAt = payload.expiredAt;
      state.accessExpiredAt = Date.now() + 43100000;
      state.loading = false;
    });
    builder.addCase(updateAccessToken.pending, (state, { payload }) => {
      state.loading = true;
    });
    builder.addCase(updateAccessToken.rejected, (state, { payload }) => {
      state.accessToken = "";
      state.user = {};
      state.refreshToken = "";
      state.expiredAt = null;
      state.loading = false;
      state.accessExpiredAt = null;
    });
  },
});

export const {
  DELETE_ACCESS_TOKEN,
  REFRESH_ACCESS_TOKEN,
  UPDATE_GOOGLE_ACCOUNT,
  UPDATE_USER_AVATAR,
  UPDATE_USER_INFO,
  SET_USER_STUDENT_ID,
  UPDATE_USER_NOTIFICATIONS,
} = auth.actions;

export default auth.reducer;

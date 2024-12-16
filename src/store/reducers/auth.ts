import { createSlice } from "@reduxjs/toolkit";
import { IAuthState } from "../types/auth";

import {
  getUserAsync,
  logInAsync,
  verifySessionAsync,
  logOutAsync,
  getAllUser,
  updateAvatarAsync,
} from "@store/actions/auth";

const initialState: IAuthState = {
  authenticated: false,
  loading: true,
  user: null,
  updatingAvatar: false,
  avatarUpdateError: null,
  token: undefined,
  updatingUser: false,
  userUpdateError: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(verifySessionAsync.fulfilled, state => {
        state.authenticated = true;
        state.loading = false;
      })
      .addCase(verifySessionAsync.rejected, state => {
        state.authenticated = false;
        state.loading = false;
      })
      .addCase(getUserAsync.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(getAllUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(getUserAsync.rejected, state => {
        state.user = null;
        state.authenticated = false;
      })
      .addCase(logInAsync.fulfilled, state => {
        state.authenticated = true;
      })
      .addCase(logInAsync.rejected, state => {
        state.authenticated = false;
      })
      .addCase(logOutAsync.fulfilled, state => {
        state.authenticated = false;
        state.user = null;
      })
      .addCase(logOutAsync.rejected, state => {
        state.authenticated = false;
        state.user = null;
      })
      .addCase(updateAvatarAsync.pending, state => {
        state.updatingAvatar = true;
        state.avatarUpdateError = null;
      })
      .addCase(updateAvatarAsync.fulfilled, (state, action) => {
        state.updatingAvatar = false;
        if (action.payload && action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(updateAvatarAsync.rejected, (state, action) => {
        state.updatingAvatar = false;
        state.avatarUpdateError =
          action.payload?.toString() || "Error desconocido";
      });
  },
});

export default authSlice.reducer;

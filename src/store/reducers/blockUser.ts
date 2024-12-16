/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { blockUserAsync, unblockUserAsync } from "../actions/user";

interface UserState {
  users: any[]; // Aquí puedes definir un tipo más específico para los usuarios
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const BlockuserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(blockUserAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(blockUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        const blockedUser = action.payload;
        const index = state.users.findIndex(user => user.id === blockedUser.id);
        if (index !== -1) {
          state.users[index] = blockedUser; // Actualizamos el estado del usuario
        }
      })
      .addCase(blockUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(unblockUserAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unblockUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        const unblockedUser = action.payload;
        const index = state.users.findIndex(
          user => user.id === unblockedUser.id
        );
        if (index !== -1) {
          state.users[index] = unblockedUser; // Actualizamos el estado del usuario
        }
      })
      .addCase(unblockUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default BlockuserSlice.reducer;

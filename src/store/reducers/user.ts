/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import {
  createAddressAsync,
  getUserAddressesAsync,
  editAddressAsync,
  deleteAddressAsync,
} from "../actions/user";

interface AddressState {
  addresses: any[]; // Aquí puedes definir un tipo más específico para las direcciones
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  loading: false,
  error: null,
};

export const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(createAddressAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAddressAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses.push(action.payload); // Añadimos la nueva dirección al array
      })
      .addCase(createAddressAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Guardamos el error si ocurre
      })
      .addCase(getUserAddressesAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserAddressesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload; // Reemplazamos el array completo con las direcciones recibidas
      })
      .addCase(getUserAddressesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Caso para editar la dirección
      .addCase(editAddressAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editAddressAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAddress = action.payload;
        // Actualizamos la dirección en el array usando el index que se pasa en la acción
        const index = state.addresses.findIndex(
          address => address.id === updatedAddress.id
        );
        if (index !== -1) {
          state.addresses[index] = updatedAddress;
        }
      })
      .addCase(editAddressAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Caso para eliminar la dirección
      .addCase(deleteAddressAsync.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddressAsync.fulfilled, (state, action) => {
        state.loading = false;
        const deletedAddressId = action.payload.id;
        state.addresses = state.addresses.filter(
          address => address.id !== deletedAddressId
        );
      })
      .addCase(deleteAddressAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default addressSlice.reducer;

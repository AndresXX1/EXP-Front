import { createSlice } from "@reduxjs/toolkit";
import { updateProductAsync, createProductAsync, getAllProductsAsync, deleteProductAsync } from "../actions/product"; // Importamos la nueva acción
import { Product } from "../types/product";

const initialState = {
  loading: false,
  products: [] as Product[],
  product: null as Product | null,
  error: null as string | null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    
      .addCase(createProductAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProductAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(createProductAsync.rejected, (state) => {
        state.loading = false;
      })

    
      .addCase(getAllProductsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProductsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getAllProductsAsync.rejected, (state) => {
        state.loading = false;
      })

      // Acción para actualizar un producto
      .addCase(updateProductAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct: Product = action.payload;
        state.products = state.products.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        );
      })
      .addCase(updateProductAsync.rejected, (state) => {
        state.loading = false;
      })

      // Acción para eliminar un producto
      .addCase(deleteProductAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
      })
      .addCase(deleteProductAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default productSlice.reducer;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createProductservice,
  getAllProductsService,
  updateProductservice,
  deleteProductservice,
} from "../services/productsPoint";

export const createProductAsync = createAsyncThunk(
  "product/createProductAsync",
  async (
    data: {
      productData: {
        name: string;
        description: string;
        value: number;
        image?: string | null;
        includesShipping: boolean;
        category?: string;
      };
      imageFile?: File;
    },
    { rejectWithValue }
  ) => {
    const formData = new FormData();

    formData.append("name", data.productData.name);
    formData.append("value", data.productData.value.toString());
    formData.append("description", data.productData.description);
    formData.append("category", data.productData.category || "ArgenCompras");
    formData.append(
      "includesShipping",
      data.productData.includesShipping ? "true" : "false"
    );

    if (data.imageFile) {
      formData.append("image", data.imageFile);
    }

    try {
      const product = await createProductservice(formData);

      if (product) {
        return product;
      } else {
        return rejectWithValue("Error al crear el producto");
      }
    } catch (error) {
      console.error(error);
      return rejectWithValue("Error inesperado");
    }
  }
);

export const getAllProductsAsync = createAsyncThunk(
  "product/getAllProductsAsync",
  async (_, { rejectWithValue }) => {
    try {
      const Products = await getAllProductsService();
      if (Products) {
        return Products;
      } else {
        return rejectWithValue("Error al obtener los productos");
      }
    } catch (error) {
      return rejectWithValue("Error inesperado al obtener los productos");
    }
  }
);

// Acción para actualizar un producto
export const updateProductAsync = createAsyncThunk(
  "product/updateProductAsync",
  async (
    { id, productData }: { id: number; productData: any },
    { rejectWithValue }
  ) => {
    try {
      const updatedProduct = await updateProductservice(id, productData);
      if (updatedProduct) {
        return updatedProduct;
      } else {
        return rejectWithValue("Error al actualizar el producto");
      }
    } catch (error) {
      return rejectWithValue("Error inesperado");
    }
  }
);

export const deleteProductAsync = createAsyncThunk(
  "product/deleteProductAsync",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await deleteProductservice(id);
      if (response) {
        return id; // Devuelvo el ID del producto eliminado para removerlo del estado
      } else {
        return rejectWithValue("Error al eliminar el producto");
      }
    } catch (error) {
      return rejectWithValue("Error inesperado al eliminar el producto");
    }
  }
);

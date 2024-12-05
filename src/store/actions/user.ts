import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  createAddressService, 
  getUserAddressesService, 
  editAddressService, 
  deleteAddressService,
   
} from '../services/addressService';
import {blockUserService, unblockUserService} from "../services/users"

// Definir el tipo de la nueva dirección (sin 'userId')
interface NewAddress {
  street: string;
  number: number;
  zipCode: string;
  city: string;
  province: string;
}

// Acción para crear una nueva dirección
export const createAddressAsync = createAsyncThunk(
  'address/create',
  async ({ userId, address }: { userId: number; address: NewAddress }, { rejectWithValue }) => {
    try {
      const response = await createAddressService(userId, address);
      return response; // Retornamos la respuesta de la API
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ocurrió un error al crear la dirección');
    }
  }
);

// Acción para obtener las direcciones de un usuario
export const getUserAddressesAsync = createAsyncThunk(
  'address/getAddresses',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await getUserAddressesService(userId);
      return response.addresses; // Asumiendo que la respuesta tiene la estructura { ok: true, addresses: [] }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener las direcciones del usuario');
    }
  }
);

export const editAddressAsync = createAsyncThunk(
  'address/edit',
  async ({ userId, index, updatedAddress }: { userId: number; index: number; updatedAddress: NewAddress }, { rejectWithValue }) => {
    try {
      const response = await editAddressService(userId, index, updatedAddress);
      return response; // Retornamos la respuesta de la API
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al editar la dirección');
    }
  }
);

// Acción para eliminar una dirección de un usuario
export const deleteAddressAsync = createAsyncThunk(
  'address/delete',
  async ({ userId, index }: { userId: number; index: number }, { rejectWithValue }) => {
    try {
      const response = await deleteAddressService(userId, index);
      return response; // Retornamos la respuesta de la API
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al eliminar la dirección');
    }
  }
);


// Acción para bloquear un usuario
export const blockUserAsync = createAsyncThunk(
  'user/block',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await blockUserService(userId);
      return response; // Retornamos la respuesta de la API
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ocurrió un error al bloquear al usuario');
    }
  }
);

// Acción para desbloquear un usuario
export const unblockUserAsync = createAsyncThunk(
  'user/unblock',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await unblockUserService(userId);
      return response; // Retornamos la respuesta de la API
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ocurrió un error al desbloquear al usuario');
    }
  }
);
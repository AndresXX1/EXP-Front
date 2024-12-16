import axios from "axios";
import { apiUrls, tokenAccess } from "@config/config";
import { alertError, alertConfirm } from "@utils/alerts";

interface NewAddress {
  street: string;
  number: number;
  zipCode: string;
  city: string;
  province: string;
}

// Servicio para crear una nueva dirección
export const createAddressService = async (
  userId: number,
  newAddress: NewAddress
) => {
  const token = localStorage.getItem(tokenAccess.tokenName);
  if (!token) {
    alertError("No se encontró el token de autenticación");
    throw new Error("No se encontró el token de autenticación");
  }

  try {
    const response = await axios.post(
      apiUrls.createAddress(userId),
      newAddress,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.ok) {
      alertConfirm("Dirección creada correctamente");
      return response.data;
    } else {
      alertError("Error al crear la dirección");
      return null;
    }
  } catch (error) {
    alertError("Error al crear la dirección");
    console.error("Error al crear la dirección", error);
    return null;
  }
};

// Servicio para obtener las direcciones de un usuario
export const getUserAddressesService = async (userId: number) => {
  const token = localStorage.getItem(tokenAccess.tokenName);
  if (!token) {
    alertError("No se encontró el token de autenticación");
    throw new Error("No se encontró el token de autenticación");
  }

  try {
    const response = await axios.get(apiUrls.getUserAddresses(userId), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    alertError("Error al obtener las direcciones");
    console.error("Error al obtener las direcciones", error);
    return null;
  }
};

// Servicio para editar una dirección
export const editAddressService = async (
  userId: number,
  index: number,
  updatedAddress: NewAddress
) => {
  const token = localStorage.getItem(tokenAccess.tokenName);
  if (!token) {
    alertError("No se encontró el token de autenticación");
    throw new Error("No se encontró el token de autenticación");
  }

  try {
    const response = await axios.put(
      apiUrls.editUserAddress(userId, index),
      updatedAddress,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.ok) {
      alertConfirm("Dirección editada correctamente");
      return response.data;
    } else {
      alertError("Error al editar la dirección");
      return null;
    }
  } catch (error) {
    alertError("Error al editar la dirección");
    console.error("Error al editar la dirección", error);
    return null;
  }
};

// Servicio para eliminar una dirección
export const deleteAddressService = async (userId: number, index: number) => {
  const token = localStorage.getItem(tokenAccess.tokenName);
  if (!token) {
    alertError("No se encontró el token de autenticación");
    throw new Error("No se encontró el token de autenticación");
  }

  try {
    const response = await axios.delete(
      apiUrls.deleteUserAddress(userId, index),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.ok) {
      alertConfirm("Dirección eliminada correctamente");
      return response.data;
    } else {
      alertError("Error al eliminar la dirección");
      return null;
    }
  } catch (error) {
    alertError("Error al eliminar la dirección");
    console.error("Error al eliminar la dirección", error);
    return null;
  }
};

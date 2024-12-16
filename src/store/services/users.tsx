import { apiUrls } from "@config/config";
import { axiosInstance } from "@store/actions/auth";
import axios from "axios";
import { alertError, alertConfirm } from "@utils/alerts";

interface UpdateUserData {
  first_name: string;
  last_name: string;
  cuil: string;
  birthday: string;
  phone: string;
}

// Servicio para obtener los usuarios
export const getusers = async () => {
  try {
    const response = await axiosInstance.get(apiUrls.getUsers());
    if (response.data.ok) {
      return response.data.users;
    } else {
      alertError("Error al obtener los usuarios");
      return [];
    }
  } catch (error) {
    alertError("Error al obtener los usuarios");
    console.error(error);
    return [];
  }
};

// Servicio para poner el cuponizate de un usuario
export const putUserCuponizateById = async (userId: number) => {
  try {
    const response = await axiosInstance.put(apiUrls.putUserCuponizate(userId));
    if (response.data.ok) {
      alertConfirm("Cuponización aplicada correctamente");
      return true;
    } else {
      alertError("Error al cuponizar el usuario");
      return false;
    }
  } catch (error) {
    alertError("Error al cuponizar el usuario");
    console.error(error);
    return false;
  }
};

// Servicio para actualizar el avatar de un usuario
export const updateAvatar = async (avatarFile: File, token: string) => {
  const formData = new FormData();
  formData.append("file", avatarFile); // Cambié 'avatar' por 'file' para que coincida con lo que espera el backend

  try {
    const urlString = apiUrls.avatarUserimage(); // Sin parámetros
    const response = await axios.put(urlString, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.ok) {
      alertConfirm("Avatar actualizado correctamente");
      return response.data;
    } else {
      alertError(response.data.message || "Error desconocido");
      throw new Error(response.data.message || "Error desconocido");
    }
  } catch (error) {
    const errorMessage = "Error en la actualización del avatar";
    alertError(errorMessage);
    console.error(errorMessage, error);
    throw new Error(errorMessage);
  }
};

// Servicio para actualizar los datos de un usuario por ID
export const updateUserById = async (
  userId: number,
  userData: UpdateUserData,
  token: string
) => {
  try {
    const response = await axiosInstance.put(
      apiUrls.putUserById(userId),
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.ok) {
      alertConfirm("Datos del usuario actualizados correctamente");
      return response.data.user;
    } else {
      alertError(response.data.message || "Error desconocido");
      throw new Error(response.data.message || "Error desconocido");
    }
  } catch (error) {
    alertError("Error en la actualización del usuario");
    console.error("Error en la actualización del usuario", error);
    throw new Error("Error en la actualización del usuario");
  }
};

// Servicio para bloquear un usuario
export const blockUserService = async (userId: number) => {
  try {
    const response = await axiosInstance.put(apiUrls.putUserBlock(userId));
    if (response.data.ok) {
      alertConfirm("Usuario bloqueado correctamente");
      return response.data.user;
    } else {
      alertError(response.data.message || "Error desconocido");
      throw new Error(response.data.message || "Error desconocido");
    }
  } catch (error) {
    alertError("Error al bloquear al usuario");
    console.error("Error al bloquear al usuario", error);
    throw new Error("Error al bloquear al usuario");
  }
};

// Servicio para desbloquear un usuario
export const unblockUserService = async (userId: number) => {
  try {
    const response = await axiosInstance.put(apiUrls.putUserUnblock(userId));
    if (response.data.ok) {
      alertConfirm("Usuario desbloqueado correctamente");
      return response.data.user;
    } else {
      alertError(response.data.message || "Error desconocido");
      throw new Error(response.data.message || "Error desconocido");
    }
  } catch (error) {
    alertError("Error al desbloquear al usuario");
    console.error("Error al desbloquear al usuario", error);
    throw new Error("Error al desbloquear al usuario");
  }
};

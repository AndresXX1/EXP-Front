import { apiUrls } from "@config/config";
import { axiosInstance } from "@store/actions/auth";
import { IErrorResponse } from "@store/types/auth";
import { alertConfirm, alertError } from "@utils/alerts";

export const getAllAdmins = async () => {
  try {
    const response = await axiosInstance.get(apiUrls.getAllAdmins());
    if (response.data.ok) {
      return response.data.admins;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

export const deleteAdminById = async (id: string) => {
  try {
    const response = await axiosInstance.delete(apiUrls.deleteAdminById(id));
    if (response.data.ok) {
      alertConfirm("Admin eliminado");
      return true;
    } else {
      alertError("Error al eliminar admin");
      return false;
    }
  } catch (error) {
    alertError("Error al eliminar admin");
    return false;
  }
};

export const uploadImgAvatar = async (file: FormData) => {
  try {
    const response = await axiosInstance.post(apiUrls.uploadImgAvatar(), file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.data.ok) {
      return response.data.avatar;
    } else {
      alertError("Error al subir imagen");
      return "";
    }
  } catch (error) {
    alertError("Error al subir imagen");
    return "";
  }
};

export const createAdmin = async (data: {
  full_name: string;
  email: string;
  password: string;
  avatar: string;
}) => {
  try {
    const response = await axiosInstance.post(apiUrls.createAdmin(), data);
    if (response.data.ok) {
      return true;
    } else {
      alertError("Error al crear admin");
      return false;
    }
  } catch (error) {
    alertError("Error al crear admin");
    return false;
  }
};

export const uploadMyAvatar = async (file: FormData) => {
  try {
    const response = await axiosInstance.put(apiUrls.uploadMyAvatar(), file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.data.ok) {
      alertConfirm("Avatar actualizado");
      return true;
    } else {
      alertError("Error al actualizar avatar");
      return false;
    }
  } catch (error) {
    alertError("Error al actualizar avatar");
    return false;
  }
};

export const removeMyAvatar = async () => {
  try {
    const response = await axiosInstance.delete(apiUrls.removeMyAvatar());
    if (response.data.ok) {
      alertConfirm("Avatar removido");
      return true;
    } else {
      alertError("Error al actualizar avatar");
      return false;
    }
  } catch (error) {
    alertError("Error al actualizar avatar");
    return false;
  }
};

export const updateFullname = async (fullName: string) => {
  try {
    const response = await axiosInstance.put(apiUrls.updateFullname(), {
      full_name: fullName,
    });
    if (response.data.ok) {
      alertConfirm("Nombre actualizado");
      return true;
    } else {
      alertError("Error al actualizar nombre");
      return false;
    }
  } catch (error) {
    alertError("Error al actualizar nombre");
    return false;
  }
};

export const updatePassword = async (data: {
  password: string;
  new_password: string;
}) => {
  try {
    const response = await axiosInstance.put(apiUrls.updatePassword(), data);
    if (response.data.ok) {
      alertConfirm("Contraseña actualizada");
      return true;
    } else {
      alertError(response.data.message);
      return false;
    }
  } catch (error) {
    const message =
      (error as IErrorResponse).response.data.message ||
      "Error al actualizar contraseña";
    alertError(message);
    return false;
  }
};

export const getData = async () => {
  try {
    const response = await axiosInstance.get(apiUrls.getData());
    if (response.data.ok) {
      return response.data.dashboard;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

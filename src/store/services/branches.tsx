import { apiUrls } from "@config/config";
import { axiosInstance } from "@store/actions/auth";
import { alertConfirm, alertError } from "@utils/alerts";

export const getBranches = async () => {
  try {
    const response = await axiosInstance.get(apiUrls.getBranches());
    if (response.data.ok) {
      return response.data.branches;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

export const uploadImgBranch = async (file: FormData) => {
  try {
    const response = await axiosInstance.post(
      apiUrls.uploadImageBranch(),
      file,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.data.ok) {
      return response.data.url;
    } else {
      alertError("Error al subir imagen");
      return "";
    }
  } catch (error) {
    alertError("Error al subir imagen");
    return "";
  }
};

export const createBranch = async (data: {
  name: string;
  image: string;
  address: string;
  schedules_1: string;
  schedules_2: string;
  whatsapp: string;
  phone: string;
  url: string;
}) => {
  try {
    const response = await axiosInstance.post(apiUrls.createBranch(), data);
    if (response.data.ok) {
      alertConfirm("Sucursal creada correctamente");
      return true;
    } else {
      alertError("Error al crear sucursal");
      return false;
    }
  } catch (error) {
    alertError("Error al crear sucursal");
    return false;
  }
};

export const updateBranch = async (
  id: string,
  data: {
    name: string;
    image: string;
    address: string;
    schedules_1: string;
    schedules_2: string;
    whatsapp: string;
    phone: string;
    url: string;
  }
) => {
  try {
    console.log("cualquier cosa");
    const response = await axiosInstance.put(apiUrls.updateBranch(id), data);
    console.log(response.data);
    if (response.data.ok) {
      alertConfirm("Sucursal actualizada correctamente");
      return true;
    } else {
      alertError("Error al actualizar la sucursal");
      return false;
    }
  } catch (error) {
    alertError("Error al actualizar la sucursal");
    return false;
  }
};

export const deleteBranchById = async (id: string) => {
  try {
    const response = await axiosInstance.delete(apiUrls.deleteBranch(id));
    if (response.data.ok) {
      alertConfirm("Sucursal eliminada correctamente");
      return true;
    } else {
      alertError("Error al eliminar la sucursal");
      return false;
    }
  } catch (error) {
    alertError("Error al eliminar la sucursal");
    return false;
  }
};

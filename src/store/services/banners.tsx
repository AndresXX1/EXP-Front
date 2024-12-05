import { apiUrls } from "@config/config";
import { axiosInstance } from "@store/actions/auth";
import { alertConfirm, alertError } from "@utils/alerts";

export const getBannersHome = async () => {
  try {
    const response = await axiosInstance.get(apiUrls.getBannersHome());
    if (response.data.ok) {
      return response.data.banners;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

export const getBannersCuponizate = async () => {
  try {
    const response = await axiosInstance.get(apiUrls.getBannersCuponizate());
    if (response.data.ok) {
      return response.data.banners;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

export const getBannersArgenCompras = async () => {
  try {
    const response = await axiosInstance.get(apiUrls.getBannersArgenCompras());
    if (response.data.ok) {
      return response.data.banners;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

export const uploadImgBanner = async (formData: FormData, type: string) => {
  try {
    const response = await axiosInstance.post(apiUrls.uploadBanner(type), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.data.ok) {
      alertConfirm("Banner subido");
      return true;
    } else {
      alertError("Error al subir banner");
      return false;
    }
  } catch (error) {
    alertError("Error al subir banner");
    return false;
  }
};

export const deleteBannerById = async (id: string) => {
  try {
    const response = await axiosInstance.delete(apiUrls.deleteBanner(id));
    if (response.data.ok) {
      alertConfirm("Banner eliminado");
      return true;
    } else {
      alertError("Error al eliminar banner");
      return false;
    }
  } catch (error) {
    alertError("Error al eliminar banner");
    return false;
  }
};

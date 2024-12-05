import { apiUrls } from "@config/config";
import { axiosInstance } from "@store/actions/auth";
import { alertConfirm, alertError } from "@utils/alerts";

export const getNotices = async () => {
  try {
    const response = await axiosInstance.get(apiUrls.getNotices());
    if (response.data.ok) {
      return response.data.notices;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

export const uploadNotice = async ({
  data,
  urlImg,
}: {
  data: { title: string; description: string; date: string };
  urlImg: string;
}) => {
  try {
    const response = await axiosInstance.post(apiUrls.uploadNotice(), {
      ...data,
      url: urlImg,
    });
    if (response.data.ok) {
      return true;
    } else {
      alertError("Error al subir imagen");
      return false;
    }
  } catch (error) {
    alertError("Error al subir imagen");
    return false;
  }
};

export const uploadImgNotice = async (file: FormData) => {
  try {
    const response = await axiosInstance.post(
      apiUrls.uploadImageNotice(),
      file,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.data.ok) {
      return response.data.notice_url;
    } else {
      alertError("Error al subir imagen");
      return "";
    }
  } catch (error) {
    alertError("Error al subir imagen");
    return "";
  }
};

export const deleteNoticeById = async (id: string) => {
  try {
    const response = await axiosInstance.delete(apiUrls.deleteNotice(id));
    if (response.data.ok) {
      alertConfirm("Noticia eliminada");
      return true;
    } else {
      alertError("Error al eliminar noticia");
      return false;
    }
  } catch (error) {
    alertError("Error al eliminar noticia");
    return false;
  }
};

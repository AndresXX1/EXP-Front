import { apiUrls } from "@config/config";
import { NotificationProps } from "@pages/Notifications";
import { axiosInstance } from "@store/actions/auth";
import { alertConfirm, alertError } from "@utils/alerts";

export const createNotification = async (
  data: NotificationProps,
  setError: (prop: string) => void
) => {
  try {
    const response = await axiosInstance.post(
      apiUrls.createNotification(),
      data
    );
    if (response.data.ok) {
      alertConfirm("Se ha creado la nueva notificación");
      return true;
    } else {
      setError(response.data.message);
      alertError("Error al crear la notificación");
      return false;
    }
  } catch (error) {
    alertError(`${error}`);
    return false;
  }
};

export const getAllNotifications = async () => {
  try {
    const response = await axiosInstance.get(apiUrls.getAllNotifications());
    if (response.data.ok) {
      return response.data.notifications;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const getNextNotifications = async () => {
  try {
    const response = await axiosInstance.get(apiUrls.getNextNotifications());
    if (response.data.ok) {
      return response.data.notifications;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const getOldNotifications = async () => {
  try {
    const response = await axiosInstance.get(apiUrls.getOldNotifications());
    if (response.data.ok) {
      return response.data.notifications;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const deleteNotification = async (id: number) => {
  try {
    const response = await axiosInstance.delete(apiUrls.deleteNotification(id));
    if (response.data.ok) {
      alertConfirm("Notificacion borrada exitosamente"); 
      return true;
    } else {
      alertError("Error al eliminar la notificación");
      return false;
    }
  } catch (error) {
    alertError(`${error}`);
    return false;
  }
};


export const updateNotification = async (
  id: number,
  data: NotificationProps,
  setError: (prop: string) => void
) => {
  try {
    const response = await axiosInstance.put(
      apiUrls.updateNotification(id), 
      data
    );
    if (response.data.ok) {
      alertConfirm("Notificación actualizada exitosamente");
      return true;
    } else {
      setError(response.data.message);
      alertError("Error al actualizar la notificación");
      return false;
    }
  } catch (error) {
    alertError(`${error}`);
    return false;
  }
};

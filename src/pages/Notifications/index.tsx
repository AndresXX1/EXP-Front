import { useEffect, useState, useRef } from "react";
import {
  IconNotification,
  ArrowBlue,
  ThreePoints,
  IconEdit,
  IconDelete,
  IconX,
  IconPencil,
} from "@utils/svg";
import Modal from "@components/Modal";
import "react-datetime/css/react-datetime.css";
import {
  createNotification,
  deleteNotification,
  getNextNotifications,
  getOldNotifications,
  updateNotification,
} from "@store/services/notification";

export interface NotificationProps {
  id: number;
  title: string;
  message: string;
  scheduledAt: Date | string;
  saveInHistory: boolean;
  isPush: boolean;
  redirect: string;
}

const getFormattedDate = (date: Date | string) => {
  const validDate = typeof date === "string" ? new Date(date) : date;

  const year = validDate.getFullYear();
  const month = String(validDate.getMonth() + 1).padStart(2, "0");
  const day = String(validDate.getDate()).padStart(2, "0");
  const hours = String(validDate.getHours()).padStart(2, "0");
  const minutes = String(validDate.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const Notifications = () => {
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
  const currentDate = new Date()
    .toLocaleString("sv-SE")
    .replace(" ", "T")
    .slice(0, 16);
  const [data, setData] = useState<NotificationProps>({
    id: 0,
    title: "",
    message: "",
    scheduledAt: new Date(currentDate),
    saveInHistory: false,
    isPush: false,
    redirect: "",
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownRefHistory = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuOpenHistory, setIsMenuOpenHistory] = useState(false);
  const [nextNotifications, setNextNotifications] = useState<
    NotificationProps[]
  >([]);
  const [oldNotifications, setOldNotifications] = useState<NotificationProps[]>(
    []
  );
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [modalEdit, setModalEdit] = useState<boolean>(false);
  const [modalCreate, setModalCreate] = useState<boolean>(false);
  const [visibleIndexOldNotifications, setVisibleIndexOldNotifications] =
    useState<number | null>(null);

  const [modalDeleteOldNotification, setModalDeleteOldNotification] =
    useState<boolean>(false);

  const [selectedOldNotificationId, setSelectedOldNotificationId] = useState<
    number | null
  >(null);

  const [errors, setErrors] = useState({
    title: "",
    message: "",
  });

  const fetchNotifications = async () => {
    const response = await getNextNotifications();
    const response2 = await getOldNotifications();
    setNextNotifications(response);
    setOldNotifications(response2);
    return;
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
        setVisibleIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRefHistory.current &&
        !dropdownRefHistory.current.contains(event.target as Node)
      ) {
        setIsMenuOpenHistory(false);
        setVisibleIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setVisibleIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visibleIndex]);

  const maxDate = new Date(
    new Date().setFullYear(new Date().getFullYear() + 10)
  )
    .toLocaleString("sv-SE", { timeZone: "America/Argentina/Buenos_Aires" })
    .replace(" ", "T")
    .slice(0, 16);

  const [error, setError] = useState<string>("");

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value;
    const year = parseInt(selectedDate.split("-")[0]);

    if (year !== 2024) {
      setError("El año de la notificación solo puede ser el actual 2024.");
      return;
    } else {
      setError("");
    }

    const parsedDate = new Date(selectedDate);
    setData({ ...data, scheduledAt: parsedDate });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "isPush" || name === "saveInHistory") {
      setData({
        ...data,
        [name]: value === "true" ? true : false,
      });
    } else {
      setData({
        ...data,
        [name]: value,
      });
    }
  };

  const handleSubmit = async () => {
    const currentDate = new Date();
    const scheduledDate = new Date(data.scheduledAt);
    if (scheduledDate < currentDate) {
      setError("La fecha no puede ser anterior a la fecha y hora actual.");
      return;
    }

    if (scheduledDate.getTime() - currentDate.getTime() < 60000) {
      setError("La fecha no puede ser anterior que la actual.");
      return;
    }
    if (!data.title.trim()) {
      setErrors(prevErrors => ({
        ...prevErrors,
        title: "El título no puede estar vacío.",
      }));
      return;
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        title: "",
      }));
    }

    if (!data.message.trim()) {
      setErrors(prevErrors => ({
        ...prevErrors,
        message: "El mensaje no puede estar vacío.",
      }));
      return;
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        message: "",
      }));
    }

    const response = await createNotification(data, setError);
    if (response) {
      setData({
        id: 0,
        title: "",
        message: "",
        scheduledAt: new Date(),
        saveInHistory: false,
        isPush: false,
        redirect: "",
      });
      setModalCreate(false);
      fetchNotifications();
    }
  };

  const handleEditNotification = (notification: NotificationProps) => {
    setData({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      scheduledAt: notification.scheduledAt,
      saveInHistory: notification.saveInHistory,
      isPush: notification.isPush,
      redirect: notification.redirect,
    });
    setModalEdit(true);
  };

  const handleSaveEditNotification = async () => {
    if (!data.title.trim()) {
      setErrors(prevErrors => ({
        ...prevErrors,
        title: "El título no puede estar vacío.",
      }));
      return;
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        title: "",
      }));
    }
    if (!data.message.trim()) {
      setErrors(prevErrors => ({
        ...prevErrors,
        message: "El mensaje no puede estar vacío.",
      }));
      return;
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        message: "",
      }));
    }
    const response = await updateNotification(data.id, data, setError);
    if (response) {
      setModalEdit(false);
      fetchNotifications();
    }
  };

  const handleConfirmDelete = async (id: number) => {
    const isDeleted = await handleDeleteNotification(id);
    if (isDeleted === true) {
      ("Notificación eliminada correctamente");
      setModalDelete(false);
      fetchNotifications();
    } else {
      ("Hubo un problema al eliminar la notificación");
    }
  };

  const handleDeleteNotification = async (id: number): Promise<boolean> => {
    try {
      await deleteNotification(id);
      console.log(`Notificación con ID ${id} eliminada correctamente`);
      return true;
    } catch (error) {
      console.error(`No se pudo eliminar la notificación con ID ${id}:`, error);
      return false;
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "America/Buenos_Aires",
    };
    return date.toLocaleString("es-AR", options).split(",")[0].trim();
  };
  const formatTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Buenos_Aires",
    };
    return date.toLocaleString("es-AR", options);
  };

  const toggleVisibilityOldNotifications = (index: number) => {
    if (visibleIndexOldNotifications === index) {
      setVisibleIndexOldNotifications(null);
    } else {
      setVisibleIndexOldNotifications(index);
    }
  };

  const handleConfirmDeleteOldNotification = async () => {
    if (selectedOldNotificationId !== null) {
      const isDeleted = await handleDeleteNotification(
        selectedOldNotificationId
      );
      if (isDeleted === true) {
        ("Notificación eliminada correctamente");
        setModalDeleteOldNotification(false);
        fetchNotifications();
      } else {
        ("Hubo un problema al eliminar la notificación");
      }
    }
  };

  console.log("Notificación a crear:", data);

  const toggleVisibility = (index: number) => {
    if (visibleIndex === index) {
      setVisibleIndex(null);
      setIsMenuOpen(false);
    } else {
      setVisibleIndex(index);
      setIsMenuOpen(true);
    }
  };

  return (
    <>
      <Modal
        isShown={modalCreate}
        element={
          <div className="px-[54px] py-12 flex flex-col w-[969px] h-[700px] mb-5">
            <div className="flex justify-between items-center">
              <p className="text-[32px] text-expresscash-textos font-bold">
                Nueva notificación
              </p>
              <p
                className="cursor-pointer"
                onClick={() => {
                  setData({
                    id: 0,
                    title: "",
                    message: "",
                    scheduledAt: new Date(currentDate),
                    saveInHistory: false,
                    isPush: false,
                    redirect: "",
                  });
                  setModalCreate(false);
                }}
              >
                <IconX />
              </p>
            </div>
            <div className="mt-5">
              <div className="flex gap-4">
                <div>
                  <div className="flex items-center justify-center rounded-[13px] w-[185px] h-[185px] bg-expresscash-gray3 border-[1px] border-solid border-expresscash-gray2">
                    <img
                      className="w-[175px] h-[175px]"
                      src="/icon.png"
                      alt="default"
                    />
                  </div>
                </div>
                <div></div>
                <div className="flex flex-col gap-4">
                  <label className="text-[14px] font-bold text-expresscash-textos">
                    Título / Nombre de la Notificación
                  </label>
                  <input
                    className="w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid border-expresscash-gray text-expresscash-textos placeholder:text-expresscash-gray text-[14px] font-book"
                    type="text"
                    name="title"
                    placeholder="Título"
                    maxLength={20}
                    value={data.title}
                    onChange={handleChange}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}

                  <div className="flex">
                    <div>
                      <label className="text-[14px] font-bold text-expresscash-textos">
                        Fecha y Hora
                      </label>
                      <input
                        className={`border-0 w-full h-[36px] pl-2 pr-10 border-b-[1px] leading-[27px] text-sofiaCall-dark font-poppinsMedium text-[13px] cursor-pointer ${error ? "border-red-500" : "border-[#C2C2C2]"}`}
                        type="datetime-local"
                        id="start_time"
                        name="scheduledAt"
                        value={getFormattedDate(data.scheduledAt)}
                        required
                        onChange={handleDateChange}
                      />

                      {error && (
                        <p className="font-poppins Medium text-red-500 text-sm mt-2">
                          {error}
                        </p>
                      )}
                    </div>
                  </div>

                  <label htmlFor="">Descripción</label>
                  <textarea
                    className="w-[617px] h-[181px] text-[16px] font-book p-3 text-expresscash-textos align-top border border-expresscash-gray rounded-[5px] resize-none placeholder:text-expresscash-textos"
                    placeholder="Cuerpo de texto"
                    name="message"
                    value={data.message}
                    onChange={handleChange}
                    maxLength={50}
                  />

                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.message}
                    </p>
                  )}
                  <div className="w-full">
                    <label className="block text-[14px] font-bold text-expresscash-textos">
                      Redirigir a:
                    </label>
                    <select
                      name="redirect"
                      value={data.redirect}
                      onChange={handleChange}
                      className="block w-full pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md text-expresscash-textos placeholder:text-expresscash-gray text-[14px] font-book"
                    >
                      <option value="">Selecciona</option>
                      <option value="noticias">Noticias</option>
                      <option value="Products">Mis préstamos</option>
                      <option value="perfil">Perfil</option>
                      <option value="argencompras">ArgenCompras</option>
                      <option value="cuponizate">Cuponizate</option>
                      <option value="canjear">Canjear puntos</option>
                      <option value="medios">
                        Medios de pago para tus cuotas
                      </option>
                    </select>
                  </div>
                  <p className="pt-5 text-[14px] font-bold text-expresscash-textos">
                    Incluye notificación Push
                  </p>
                  <div className="flex gap-5">
                    <div className="flex items-center gap-3 rounded-[4px]">
                      <input
                        id="push-notification-yes"
                        className="border-[1px] border-solid border-expresscash-gray rounded-[full] mr-2"
                        type="radio"
                        name="isPush"
                        value="true"
                        checked={data.isPush}
                        onChange={handleChange}
                      />
                      <label
                        htmlFor="push-notification-yes"
                        className="text-[14px] font-book leading-[24px] text-expresscash-textos"
                      >
                        Si
                      </label>
                    </div>
                    <div className="flex items-center gap-3 rounded-[4px]">
                      <input
                        id="push-notification-no"
                        className="border-[1px] border-solid border-expresscash-gray rounded-[full] mr-2"
                        type="radio"
                        name="isPush"
                        value="false"
                        checked={!data.isPush}
                        onChange={handleChange}
                      />
                      <label
                        htmlFor="push-notification-no"
                        className="text-[14px] font-book leading-[24px] text-expresscash-textos"
                      >
                        No
                      </label>
                    </div>
                  </div>

                  <p className="pt-5 text-[14px] font-bold text-expresscash-textos">
                    Incluye notificación In-App
                  </p>
                  <div className="flex gap-5">
                    <div className="flex items-center gap-3 rounded-[4px]">
                      <input
                        id="in-app-notification-yes"
                        className="border-[1px] border-solid border-expresscash-gray rounded-[full] mr-2"
                        type="radio"
                        value="true"
                        name="saveInHistory"
                        checked={data.saveInHistory}
                        onChange={handleChange}
                      />
                      <label
                        htmlFor="in-app-notification-yes"
                        className="text-[14px] font-book leading-[24px] text-expresscash-textos"
                      >
                        Si
                      </label>
                    </div>
                    <div className="flex items-center gap-3 rounded-[4px]">
                      <input
                        id="in-app-notification-no"
                        className="border-[1px] border-solid border-expresscash-gray rounded-[full] mr-2"
                        type="radio"
                        value="false"
                        name="saveInHistory"
                        checked={!data.saveInHistory}
                        onChange={handleChange}
                      />
                      <label
                        htmlFor="in-app-notification-no"
                        className="text-[14px] font-book leading-[24px] text-expresscash-textos"
                      >
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-10 pb-10">
              <button
                onClick={() => {
                  setData({
                    id: 0,
                    title: "",
                    message: "",
                    scheduledAt: new Date(currentDate),
                    saveInHistory: false,
                    isPush: false,
                    redirect: "",
                  });
                  setModalCreate(false);
                }}
                className="border-[1px] border-expresscash-gray3 rounded-[10px] text-expresscash-textos text-[14px] px-4 py-2"
              >
                Cancelar
              </button>

              <button
                onClick={handleSubmit}
                className="bg-expresscash-skyBlue w-[109px] h-[38px] rounded-[5px] text-expresscash-white text-[1rem] font-book"
              >
                Guardar
              </button>
            </div>
          </div>
        }
      />
      <Modal
        isShown={modalEdit}
        element={
          <div className="px-[54px] py-12 flex flex-col w-[969px] h-[700px] mb-5">
            <div className="flex justify-between items-center">
              <p className="text-[32px] text-expresscash-textos font-bold">
                Editar notificación
              </p>
              <p className="cursor-pointer" onClick={() => setModalEdit(false)}>
                <IconX />
              </p>
            </div>
            <div className="mt-5">
              <div className="flex gap-4">
                <div>
                  <div className="flex items-center justify-center rounded-[13px] w-[185px] h-[185px] bg-expresscash-gray3 border-[1px] border-solid border-expresscash-gray2">
                    <img
                      className="w-[84px] h-[84px]"
                      src="/Products/image_default.png"
                    />
                  </div>
                  <p className="flex gap-1 items-center pt-[18px] text-[14px] font-book text-expresscash-textos">
                    <IconPencil />
                    Subir una imagen
                  </p>
                </div>
                <div></div>
                <div className="flex flex-col gap-4">
                  <label
                    htmlFor=""
                    className="text-[14px] font-bold text-expresscash-textos"
                  >
                    Título / Nombre de la App
                  </label>
                  <input
                    name="title"
                    value={data.title}
                    onChange={handleChange}
                    className="w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid border-expresscash-gray text-expresscash-textos placeholder:text-expresscash-gray text-[14px] font-bold"
                    type="text"
                    placeholder="Título"
                    maxLength={20}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                  <label htmlFor="">Descripción</label>
                  <textarea
                    name="message"
                    value={data.message}
                    onChange={handleChange}
                    className="w-[617px] h-[181px] text-[16px] font-bold p-3 text-expresscash-textos align-top border border-expresscash-gray rounded-[5px] resize-none placeholder:text-expresscash-textos"
                    placeholder="Cuerpo de texto"
                    maxLength={50}
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.message}
                    </p>
                  )}
                  Fecha
                  <div className="flex">
                    <div className="flex items-center">
                      <label className="text-[14px] font-bold text-expresscash-textos"></label>
                      <div className="relative">
                        <input
                          type="datetime-local"
                          name="scheduledAt"
                          value={
                            data.scheduledAt instanceof Date
                              ? new Date(
                                  data.scheduledAt.getTime() -
                                    new Date().getTimezoneOffset() * 60000
                                )
                                  .toISOString()
                                  .slice(0, 16)
                              : typeof data.scheduledAt === "string"
                                ? data.scheduledAt.slice(0, 16)
                                : ""
                          }
                          min={currentDate}
                          max={maxDate}
                          required
                          onChange={handleDateChange}
                          className="w-[298px] h-[54px] rounded-[5px] font-bold border-[1px] border-solid border-expresscash-gray text-expresscash-textos placeholder:text-expresscash-gray text-[14px] font-book pl-3 pr-10"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2"></div>
                      </div>
                      {error && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                      )}
                    </div>
                  </div>
                  <div className="w-full">
                    <label className="block text-[14px] font-bold text-expresscash-textos">
                      Redirigir a:
                    </label>
                    <select
                      name="redirect"
                      value={data.redirect}
                      onChange={handleChange}
                      className="block w-full pl-3 pr-10 py-3 text-base border font-bold border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md text-expresscash-textos placeholder:text-expresscash-gray text-[14px] font-book"
                    >
                      <option value="">Selecciona</option>
                      <option value="noticias">Noticias</option>
                      <option value="Products">Mis préstamos</option>
                      <option value="perfil">Perfil</option>
                      <option value="argencompras">ArgenCompras</option>
                      <option value="cuponizate">Cuponizate</option>
                      <option value="canjear">Canjear puntos</option>
                      <option value="medios">
                        Medios de pago para tus cuotas
                      </option>
                    </select>
                  </div>
                  <div>
                    <p className="pt-5 text-[14px] font-bold text-expresscash-textos">
                      Incluye notificación push
                    </p>
                    <select
                      name="isPush"
                      value={data.isPush.toString()}
                      onChange={e =>
                        setData({
                          ...data,
                          isPush: e.target.value === "true",
                        })
                      }
                      className="w-full h-[54px] font-bold rounded-[5px] border-[1px] border-solid border-expresscash-gray text-expresscash-textos text-[14px] font-book px-3"
                    >
                      <option value="true">Si</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div>
                    <p className="pt-5 text-[14px] font-bold text-expresscash-textos">
                      Incluye notificación In-App
                    </p>
                    <select
                      name="saveInHistory"
                      value={data.saveInHistory.toString()}
                      onChange={e =>
                        setData({
                          ...data,
                          saveInHistory: e.target.value === "true",
                        })
                      }
                      className="w-full h-[54px] font-bold rounded-[5px] border-[1px] border-solid border-expresscash-gray text-expresscash-textos text-[14px] font-book px-3"
                    >
                      <option value="true">Si</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-10 pb-10">
              <button
                onClick={() => setModalEdit(false)}
                className="border-[1px] border-solid border-expresscash-gray w-[109px] h-[38px] rounded-[5px] text-expresscash-gray text-[1rem] font-book"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEditNotification}
                className="bg-expresscash-skyBlue w-[109px] h-[38px] rounded-[5px] text-expresscash-white text-[1rem] font-book hover:bg-expresscash-blue hover:transition-colors duration-100"
              >
                Guardar
              </button>
            </div>
          </div>
        }
      />

      <div className="flex flex-col pl-12 pt-12 px-10 h-[100%]">
        <p className="text-[3rem] text-expresscash-textos font-bold pb-14 translate-x-[60px]">
          Notificaciones
        </p>

        <div className="flex gap-6 translate-x-[60px]">
          <input
            className="w-[735px] h-[54px] rounded-[13px] border-[1px] border-expresscash-textos border-solid px-10 text-expresscash-gray2 placeholder:text-expresscash-gray2 placeholder:font-book"
            type="search"
            placeholder="Buscar estadísticas o datos"
          />
          <button
            onClick={() => {
              setData({
                id: 0,
                title: "",
                message: "",
                scheduledAt: new Date(currentDate),
                saveInHistory: false,
                isPush: false,
                redirect: "",
              });
              setModalCreate(true);
            }}
            className="w-[219px] h-[54px] bg-expresscash-skyBlue rounded-[13px] flex items-center justify-center text-expresscash-white gap-1 hover:bg-expresscash-blue hover:transition-colors duration-100"
          >
            <IconNotification />
            Nueva notificación
          </button>
        </div>
        <h4 className="text-[23px] font-bold text-expresscash-textos pt-5 mb-5 translate-x-[60px]">
          Próximas notificaciones
        </h4>

        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_0.5fr] gap-8 my-8 translate-x-[60px]">
          <p className="text-[1rem] text-expresscash-textos font-bold">
            Nombre
          </p>
          <div className="flex gap-3 items-center">
            <p className="text-[1rem] text-expresscash-textos font-bold">
              Fecha
            </p>
            <ArrowBlue />
          </div>

          <p className="text-[1rem] text-expresscash-textos font-bold">Hora</p>
          <p className="text-[1rem] text-expresscash-textos font-bold">
            In-App
          </p>
          <p className="text-[1rem] text-expresscash-textos font-bold">Push</p>
          <p className="text-[1rem] text-expresscash-textos font-bold">
            Mensaje
          </p>
          <p className="text-[1rem] text-expresscash-textos font-bold">
            Redireccionado
          </p>
          <p className="text-[1rem] text-expresscash-textos font-bold"></p>
        </div>
        <div>
          {nextNotifications &&
            nextNotifications.map((inf, index) => (
              <div
                className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_0.8fr_0.8fr] gap-6 my-8 translate-x-[60px]"
                key={index}
              >
                <div className="flex items-center gap-1">
                  <p className="text-[1rem] text-expresscash-textos font-book">
                    {inf.title}
                  </p>
                </div>
                <p className="text-[1rem] text-expresscash-textos font-book">
                  {formatDate(inf.scheduledAt)}
                </p>
                <p className="text-[1rem] text-expresscash-textos font-book ml-1">
                  {formatTime(inf.scheduledAt)}
                </p>
                <p className="text-[1rem] text-expresscash-textos font-book ml-6">
                  {inf.saveInHistory ? "Si" : "No"}
                </p>
                <p className="text-[1rem] text-expresscash-textos font-book ml-6">
                  {inf.isPush ? "Si" : "No"}
                </p>
                <p className="text-[1rem] text-expresscash-textos font-book truncate max-w-xs">
                  {inf.message}
                </p>
                <p className="text-[1rem] text-expresscash-textos font-book ml-6 truncate max-w-xs">
                  {inf.redirect}
                </p>
                <div
                  ref={dropdownRef}
                  onClick={e => {
                    e.stopPropagation();
                    setIsMenuOpen(true);
                  }}
                  className="relative flex items-center justify-center translate-y-[0px] translate-x-[-5px]"
                >
                  <button
                    onClick={() => toggleVisibility(index)}
                    className="relative z-80"
                  >
                    {visibleIndex === index ? <ThreePoints /> : <ThreePoints />}
                  </button>
                  {isMenuOpen && visibleIndex === index && (
                    <div
                      ref={dropdownRef}
                      onClick={e => e.stopPropagation()}
                      className={`absolute top-full right-0 z-10 transition-all duration-2000 ease-in-out ${
                        visibleIndex === index
                          ? "opacity-100 h-[90px]"
                          : "opacity-0 max-h-0"
                      } bg-expresscash-white border-[1px] border-solid border-expresscash-gray rounded-[7px] w-[158px]`}
                      style={{
                        transform:
                          visibleIndex === index
                            ? "translateY(-10px)"
                            : "translateY(-100%)",
                      }}
                    >
                      <div className="flex flex-col w-full gap-3 items-center justify-center h-full">
                        <p
                          onClick={e => {
                            e.stopPropagation();
                            handleEditNotification(inf);
                          }}
                          className="flex items-center mr-7 cursor-pointer"
                        >
                          <IconEdit color="#575757" />
                          Editar
                        </p>
                        <div
                          onClick={e => {
                            e.stopPropagation();
                            setModalDelete(true);
                          }}
                          className="flex items-center mr-3 cursor-pointer"
                        >
                          <IconDelete />
                          Eliminar
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="w-[125%] h-[1px] bg-expresscash-gray mt-5 col-span-6 mb-10"></div>
                <Modal
                  isShown={modalDelete}
                  element={
                    <div className="px-6 py-6 flex flex-col justify-center w-[481px] h-[192px]">
                      <div className="flex justify-between items-start">
                        <p className="text-[1rem] text-expresscash-textos font-bold">
                          ¿Está seguro que desea eliminar esta Notificacion?
                        </p>
                        <p
                          className="cursor-pointer mt-[6px]"
                          onClick={() => setModalDelete(false)}
                        >
                          <IconX />
                        </p>
                      </div>
                      <p className="text-[14px] font-book text-expresscash-gray w-[380px] mb-10 mt-1">
                        Si la elimina ya no se podrá recuperarla.
                      </p>
                      <div className="flex gap-4">
                        <button
                          onClick={() => {
                            handleConfirmDelete(inf.id);
                          }}
                          className="bg-expresscash-red w-[109px] h-[38px] rounded-[5px] text-expresscash-white text-[1rem] font-book"
                        >
                          Eliminar
                        </button>
                        <button
                          onClick={() => {
                            setModalDelete(false);
                          }}
                          className="border-[1px] border-solid border-expresscash-gray w-[109px] h-[38px] rounded-[5px] text-expresscash-gray text-[1rem] font-book"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  }
                ></Modal>
              </div>
            ))}

          <h4 className="text-[23px] font-bold text-expresscash-textos mt-5 mb-10 translate-x-[60px]">
            Historial de notificaciones
          </h4>
          <div>
            {oldNotifications &&
              oldNotifications.map((inf, index) => (
                <div
                  className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_0.6fr] gap-6 my-8 translate-x-[60px]"
                  key={index}
                >
                  <div className="flex items-center gap-1">
                    <p className="text-[1rem] text-expresscash-textos font-book">
                      {inf.title}
                    </p>
                  </div>
                  <p className="text-[1rem] text-expresscash-textos font-book">
                    {formatDate(inf.scheduledAt)}
                  </p>
                  <p className="text-[1rem] text-expresscash-textos font-book ml-1">
                    {formatTime(inf.scheduledAt)}
                  </p>
                  <p className="text-[1rem] text-expresscash-textos font-book ml-6">
                    {inf.saveInHistory ? "Si" : "No"}
                  </p>
                  <p className="text-[1rem] text-expresscash-textos font-book ml-6">
                    {inf.isPush ? "Si" : "No"}
                  </p>
                  <p className="text-[1rem] text-expresscash-textos font-book truncate max-w-xs">
                    {inf.message}
                  </p>
                  <p className="text-[1rem] text-expresscash-textos font-book ml-6 truncate max-w-xs">
                    {inf.redirect}
                  </p>
                  <div className="relative flex items-center justify-center translate-x-[-20px]">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleVisibilityOldNotifications(index);
                        setIsMenuOpenHistory(true);
                      }}
                    >
                      <ThreePoints />
                    </button>

                    {isMenuOpenHistory &&
                      visibleIndexOldNotifications === index && (
                        <div
                          ref={dropdownRefHistory}
                          className="absolute top-full right-0 z-50 mt-2 bg-expresscash-white border-[1px] border-solid border-expresscash-gray rounded-[7px] w-[158px] shadow-lg"
                          onClick={e => e.stopPropagation()}
                        >
                          <div className="flex flex-col w-full gap-3 items-center justify-center py-3">
                            <p
                              onClick={() => {
                                setSelectedOldNotificationId(inf.id);
                                setModalDeleteOldNotification(true);
                                setIsMenuOpenHistory(false);
                                setVisibleIndexOldNotifications(null);
                              }}
                              className="flex items-center mr-3 cursor-pointer hover:bg-gray-100 w-full text-center justify-center"
                            >
                              <IconDelete className="mr-2" />
                              Eliminar
                            </p>
                          </div>
                        </div>
                      )}
                  </div>
                  <Modal
                    isShown={modalDeleteOldNotification}
                    element={
                      <div className="px-6 py-6 flex flex-col justify-center w-[481px] h-[192px]">
                        <div className="flex justify-between items-start">
                          <p className="text-[1rem] text-expresscash-textos font-bold">
                            ¿Está seguro que desea eliminar esta Notificacion?
                          </p>
                          <p
                            className="cursor-pointer mt-[6px]"
                            onClick={() => setModalDeleteOldNotification(false)}
                          >
                            <IconX />
                          </p>
                        </div>
                        <p className="text-[14px] font-book text-expresscash-gray w-[380px] mb-10 mt-1">
                          Si la elimina ya no se podrá recuperarla.
                        </p>
                        <div className="flex gap-4">
                          <button
                            onClick={handleConfirmDeleteOldNotification}
                            className="bg-expresscash-red w-[109px] h-[38px] rounded-[5px] text-expresscash-white text-[1rem] font-book"
                          >
                            Eliminar
                          </button>
                          <button
                            onClick={() => {
                              setModalDeleteOldNotification(false);
                            }}
                            className="border-[1px] border-solid border-expresscash-gray w-[109px] h-[38px] rounded-[5px] text-expresscash-gray text-[1rem] font-book"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    }
                  ></Modal>
                  <div className="w-[125%] h-[1px] bg-expresscash-gray mt-5 col-span-6 mb-10"></div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Notifications;

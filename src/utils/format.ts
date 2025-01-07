import { parseISO, format } from "date-fns";
import { es } from "date-fns/locale";

import {
  IconHome,
  IconUser,
  // IconProducts,
  // IconEdits,
  IconPrestamos,
  IconNotifications,
  IconConfig,
} from "./svg";

export const links = [
  {
    to: "/dashboard",
    text: "Home",
    active: ["/dashboard"],
    Icon: IconHome,
  },
  {
    to: "/dashboard/loans",
    text: "Prestamos",
    active: ["/dashboard/loans"],
    Icon: IconPrestamos,
  },
  {
    to: "/dashboard/Clients",
    text: "Clientes",
    active: ["/dashboard/Clients"],
    Icon: IconUser,
  },
  // {
  //   to: "/dashboard/edit-content",
  //   text: "Editar contenido",
  //   active: ["/dashboard/edit-content"],
  //   Icon: IconEdits,
  // },
  {
    to: "/dashboard/notifications",
    text: "Notificaciones",
    active: ["/dashboard/notifications"],
    Icon: IconNotifications,
  },
  {
    to: "/dashboard/setting",
    text: "Configuración",
    active: ["/dashboard/setting"],
    Icon: IconConfig,
  },
];

export const formatDateString = (dateString: string) => {
  const date = parseISO(dateString);
  return format(date, "MMMM d yyyy, HH:mm'h'", { locale: es });
};

export const calculateAge = (birthDateString: string) => {
  if (!birthDateString) return "No disponible";
  const birthDate = new Date(birthDateString);
  const currentDate = new Date();

  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDifference = currentDate.getMonth() - birthDate.getMonth();
  const dayDifference = currentDate.getDate() - birthDate.getDate();
  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  return age;
};

export const getFormattedDate = () => {
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const now = new Date();
  const year = now.getFullYear();
  const month = monthNames[now.getMonth()];

  // Calcular la semana del mes actual
  const startOfMonth = new Date(year, now.getMonth(), 1);
  const weekNumber = Math.ceil((now.getDate() + startOfMonth.getDay()) / 7);

  return `${month} ${year}, semana ${weekNumber}`;
};

export const capitalizeFirstLetter = (text: string) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatSecondsToMinutes = (seconds: number): string => {
  if (seconds < 0) return "00:00"; // Validar si el valor de los segundos es válido

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Rellenar con ceros si los valores son menores a 10
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};

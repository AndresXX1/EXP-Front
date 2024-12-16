/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ArrowLeft, Mail, MoreVertical, Phone } from "lucide-react";
import React, { useState, useEffect } from "react";
import Modal from "@components/Modal";
import { EditUserModal } from "./editUserModal"; // Asegúrate de que este componente exista
import { Address } from "../../store/types/user";
import { IconDelete, IconEdit, IconX } from "@utils/svg";
import { User, Prestamo } from "../../store/types/user";

export interface UserFormData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  phone: string;
  avatar: string;
  cuil: string;
  gender: string;
  subscriptionStatus: string | number | readonly string[] | undefined;
  birthday: string;
  points: number;
  image: string;
  address: Address[];
  Prestamo: Prestamo[];
  bank: string;
  paymentDate: string;
  lastLogin: string;
  createdAt: string;
  status: string;
  totalLoaned: number;
}

interface UserDetailsModalProps {
  user?: User; // user es opcional, por lo que puede ser undefined
  onClose: () => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onEditPrestamo: (prestamo: Prestamo, index: number) => void;
  onDeletePrestamo: (index: number) => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  onClose,
  onEdit,
}) => {
  const dropdownRef = React.createRef<HTMLDivElement>();
  const [showPrestamoModal, setShowPrestamoModal] = useState(false); // Modal de edición de préstamo
  const [formData, setFormData] = useState<Prestamo | null>(null); // Datos del préstamo a editar
  const [modalDelete, setModalDelete] = useState(false); // Estado para abrir o cerrar el modal de eliminación
  const [showUserEditModal, setShowUserEditModal] = useState(false); // Modal de edición de usuario
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  // Detecta la tecla ArrowLeft y ejecuta onClose para volver al listado de usuarios
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        onClose(); // Cierra el modal al presionar ArrowLeft
      }
    };

    window.addEventListener("keydown", handleKeydown);

    // Limpiar el evento cuando el componente se desmonte
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [onClose]);

  useEffect(() => {
    // Función para detectar clics fuera del menú
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setVisibleIndex(null); // Cierra el menú si el clic es fuera del dropdown
      }
    };

    // Si el menú está visible, agregamos el event listener
    if (visibleIndex !== null) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    // Limpiar el event listener cuando el componente se desmonte o el estado cambie
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [visibleIndex]);

  // Abre el modal de edición de usuario
  const handleEditUser = () => {
    setShowUserEditModal(true); // Muestra el modal de edición de usuario
  };

  const handleCloseUserEditModal = () => {
    setShowUserEditModal(false); // Cierra el modal de edición de usuario
  };

  const handleClosePrestamoModal = () => {
    setShowPrestamoModal(false); // Cierra el modal de edición de préstamo
  };

  // Guardar cambios del préstamo editado
  const handleSavePrestamo = () => {
    if (formData && user) {
      const updatedProducts = user.Prestamo.map(
        (prestamo: { numero: string }) =>
          prestamo.numero === formData.numero ? formData : prestamo
      ); // Actualizar el usuario con el préstamo editado
      setShowPrestamoModal(false); // Cerrar el modal
    }
  };

  // Eliminar un préstamo
  const handleDeletePrestamo = (index: number) => {
    if (user) {
      const updatedProducts = user.Prestamo.filter(
        (_: any, i: number) => i !== index
      );
      onEdit({
        ...user,
        Prestamo: updatedProducts,
      }); // Eliminar el préstamo del array
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-expresscash-textos">Cargando datos del usuario...</p>
      </div>
    );
  }

  const transformUserToFormData = (user: User): UserFormData => ({
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    dni: user.dni,
    phone: user.phone,
    avatar: "",
    cuil: "",
    gender: "",
    subscriptionStatus: "", // Ensure this matches the type in UserFormData
    Prestamo: user.Prestamo,
    birthday: "",
    points: 0,
    image: "",
    address: user.address,
    bank: "",
    paymentDate: "",
    lastLogin: "",
    createdAt: "",
    status: "",
    totalLoaned: 0,
  });

  const handleEdit = (updatedUser: UserFormData) => {
    const updatedUserData: User = {
      id: updatedUser.id,
      first_name: updatedUser.firstName,
      last_name: updatedUser.lastName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      dni: updatedUser.dni,
      address: updatedUser.address,
      Prestamo: updatedUser.Prestamo,
      last_login: "",
      create: "",
      image: "",
      status: "",
      totalLoaned: 0,
      birthday: "",
      points: 0,
      cuponizate: false,
      avatar: "",
      gender: "",
      cuil: "",
      bank: "",
      paymentDate: "",
      prestamo: [],
    };

    onEdit(updatedUserData);
  };

  const toggleMenu = (event: React.MouseEvent, index: number) => {
    event.stopPropagation(); // Evita que el clic se propague

    // Verifica si index es un número válido
    if (typeof index !== "number") return;

    // Obtener las coordenadas del clic para posicionar el menú correctamente
    const { clientX, clientY } = event;

    if (visibleIndex === index) {
      setVisibleIndex(null); // Si ya está visible, lo cerramos
    } else {
      setMenuPosition({ top: clientY, left: clientX }); // Actualizamos la posición del menú
      setVisibleIndex(index); // Si no está visible, lo mostramos
    }
  };

  const handleEditPrestamo = (prestamo: Prestamo, _index: number) => {
    setFormData(prestamo); // Establecer los datos del préstamo a editar
    setShowPrestamoModal(true); // Abrir el modal de edición de préstamo
    setVisibleIndex(null); // Cerrar el menú de tres puntos
  };

  return (
    <div className="flex flex-col bg-white p-6 max-w-4xl w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="text-expresscash-textos hover:text-expresscash-black"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-medium text-expresscash-textos">
            {user.first_name} {user.last_name}
          </h1>
        </div>
        <button
          onClick={handleEditUser}
          className="px-4 py-2 bg-expresscash-skyBlue text-white rounded-lg hover:bg-opacity-90 translate-x-[300px]"
        >
          Editar usuario
        </button>
      </div>

      {/* Datos del cliente */}
      <div className="mb-12 mt-12">
        <h2 className="text-2xl font-medium text-expresscash-textos mb-12">
          Datos del cliente
        </h2>
        <div className="flex flex-wrap gap-[50px] mt-[20px] w-[1250px]">
          {/* Nombre y apellido */}
          <div className="flex items-center gap-4 w-full sm:w-1/4 md:w-1/5 px-[10px]">
            <div className="w-5 h-5 text-expresscash-textos" />
            <div>
              <p className="text-sm text-expresscash-textos">
                Nombre y apellido
              </p>
              <p className="text-expresscash-black">
                {user.first_name} {user.last_name}
              </p>
            </div>
          </div>

          {/* Documento / ID */}
          <div className="flex items-center gap-4 w-full sm:w-1/4 md:w-1/5 px-[10px] ml-[20px]">
            <div className="w-5 h-5 flex items-center justify-center text-expresscash-textos">
              <span className="text-sm font-medium">ID</span>
            </div>
            <div>
              <p className="text-sm text-expresscash-textos">Documento</p>
              <p className="text-expresscash-black">{user.dni}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4 w-full sm:w-1/4 md:w-1/5 px-[10px] ml-[20px]">
            <Mail className="w-5 h-5 text-expresscash-textos" />
            <div>
              <p className="text-sm text-expresscash-textos">Email</p>
              <p className="text-expresscash-skyBlue">{user.email}</p>
            </div>
          </div>

          {/* Teléfono */}
          <div className="flex items-center gap-4 w-full sm:w-1/4 md:w-1/5 px-[10px] ml-[10px]">
            <Phone className="w-5 h-5 text-expresscash-textos" />
            <div>
              <p className="text-sm text-expresscash-textos">Teléfono</p>
              <p className="text-expresscash-skyBlue">{user.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de préstamos */}
      <div>
        <h2 className="text-2xl font-medium text-expresscash-textos mb-8 mt-5">
          Préstamos
        </h2>
        {/* Verificar si el array de préstamos está vacío */}
        {user.Prestamo.length === 0 ? (
          <>
            <div className="translate-x-[190px]">
              <div className="ml-[370px] mt-[150px]">
                {/* <IconProductsBig /> */}
              </div>
              <p className="text-center text-expresscash-textos">
                Este cliente no ha sacado ningún préstamo aún
              </p>
            </div>
          </>
        ) : (
          <div className="overflow-x-auto w-[1200px] h-[500px] translate-x-[0px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-expresscash-gray">
                  <th className="text-center py-3 px-4 min-w-[200px] text-expresscash-black font-medium">
                    Número
                  </th>
                  <th className="text-center py-3 px-4 min-w-[200px] text-expresscash-black font-medium">
                    Fecha
                  </th>
                  <th className="text-center py-3 px-4 min-w-[200px] text-expresscash-black font-medium">
                    Monto
                  </th>
                  <th className="text-center py-3 px-4 min-w-[200px] text-expresscash-black font-medium">
                    Estado del pago
                  </th>
                  <th className="text-center py-3 px-4 min-w-[200px] text-expresscash-black font-medium">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {user.Prestamo.map((prestamo: Prestamo, index: number) => (
                  <tr
                    key={index}
                    className={`${
                      index !== user.Prestamo.length - 1
                        ? "border-b border-expresscash-gray"
                        : ""
                    }`} // Añade borde entre las filas, excepto después de la última
                  >
                    <td className="py-10 px-16 text-center text-expresscash-skyBlue min-w-[200px]">
                      {prestamo.numero}
                    </td>
                    <td className="py-10 px-16 text-center text-expresscash-textos min-w-[200px]">
                      {prestamo.fecha}
                    </td>
                    <td className="py-10 px-16 text-center text-expresscash-textos min-w-[200px]">
                      ${prestamo.monto}
                    </td>
                    <td className="py-10 px-16 text-center">
                      <span
                        className={`text-sm font-medium min-w-[200px] ${
                          prestamo.estado_pago === "pagado"
                            ? "text-expresscash-green"
                            : prestamo.estado_pago === "en_mora"
                              ? "text-expresscash-red"
                              : prestamo.estado_pago === "en_proceso"
                                ? "text-expresscash-yellow"
                                : prestamo.estado_pago === "vencido"
                                  ? "text-expresscash-gray"
                                  : prestamo.estado_pago === "pendiente"
                                    ? "text-expresscash-orange-yellow"
                                    : prestamo.estado_pago ===
                                        "parcialmente_pagado"
                                      ? "text-expresscash-lightgreen"
                                      : prestamo.estado_pago === "reprogramado"
                                        ? "text-expresscash-blue"
                                        : ""
                        }`}
                      >
                        {prestamo.estado_pago}
                      </span>
                    </td>
                    <td className="py-12 px-16 text-center relative">
                      {/* Botón de tres puntos para abrir el menú */}
                      <button
                        className="p-2 rounded-full hover:bg-gray-100"
                        onClick={event => toggleMenu(event, Number(index))}
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {/* Menú desplegable */}
                      {visibleIndex === index && menuPosition && (
                        <div
                          ref={dropdownRef}
                          className="absolute z-10 bg-expresscash-white border border-expresscash-gray rounded-lg w-[158px] p-2"
                          style={{
                            top: `${menuPosition.top - 470}px`,
                            left: `${menuPosition.left - 1440}px`,
                          }}
                        >
                          <div className="flex flex-col gap-2">
                            {/* Opción para editar */}
                            <div
                              onClick={e => {
                                e.stopPropagation();
                                handleEditPrestamo(prestamo, index);
                              }}
                              className="cursor-pointer hover:bg-gray-200 p-2 rounded-lg flex items-center"
                            >
                              <IconEdit
                                className="w-6.5 h-6.5 translate-x-[-5px]"
                                color="#575757"
                              />
                              <span>Editar</span>
                            </div>

                            {/* Opción para eliminar */}
                            <div
                              onClick={e => {
                                e.stopPropagation();
                                setModalDelete(true); // Mostramos el modal de confirmación
                              }}
                              className="cursor-pointer hover:bg-gray-200 p-2 rounded-lg flex items-center"
                            >
                              <IconDelete className="w-6.5 h-6.5 translate-x-[-5px]" />
                              <span>Eliminar</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Modal de confirmación de eliminación */}

      {/* Modal para editar préstamo */}
      {showPrestamoModal && formData && (
        <Modal
          isShown={showPrestamoModal}
          closeModal={handleClosePrestamoModal}
          element={
            <div className="w-[400px] p-6 space-y-8">
              <h2 className="text-2xl font-medium text-expresscash-black mb-6">
                Editar préstamo
              </h2>
              <div className="space-y-4">
                <label className="text-sm text-expresscash-textos block">
                  Prestamo número:
                </label>
                <label className="text-sm text-expresscash-skyBlue">
                  {"    " + formData.numero}
                </label>
              </div>
              <div className="space-y-4">
                <label className="text-sm text-expresscash-textos block">
                  Fecha
                </label>
                {formData.fecha}
              </div>
              <div className="space-y-2">
                <label className="text-sm text-expresscash-textos block">
                  Monto
                </label>
                <input
                  type="number"
                  name="monto"
                  value={formData.monto}
                  onChange={e => {
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.value,
                    });
                  }}
                  className="p-2 w-full border border-expresscash-gray3 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-expresscash-textos block">
                  Estado de pago
                </label>
                <select
                  name="estado_pago"
                  value={formData.estado_pago}
                  onChange={e => {
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.value,
                    });
                  }}
                  className="p-2 w-full border border-expresscash-gray3 rounded-lg"
                >
                  <option value="pagado">Pagado</option>
                  <option value="en_mora">En Mora</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="vencido">Vencido</option>
                  <option value="pendiente">Pendiente</option>{" "}
                  {/* Otra opción adicional */}
                  <option value="parcialmente_pagado">
                    Parcialmente Pagado
                  </option>{" "}
                  {/* Otra opción */}
                  <option value="reprogramado">Reprogramado</option>{" "}
                  {/* Opción adicional */}
                </select>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={handleSavePrestamo}
                  className="bg-expresscash-skyBlue text-white rounded-lg px-6 py-2"
                >
                  Guardar
                </button>
                <button
                  onClick={handleClosePrestamoModal}
                  className="text-expresscash-redDark hover:text-expresscash-redDark"
                >
                  Cancelar
                </button>
              </div>
            </div>
          }
        />
      )}

      {/* Modal de confirmación de eliminación */}
      <Modal
        isShown={modalDelete}
        closeModal={() => {
          setModalDelete(false); // Cerrar el modal
          setVisibleIndex(null); // Cerrar el menú de opciones de editar/eliminar
        }}
        element={
          <div className="px-6 py-6 flex flex-col justify-center w-[481px] h-[192px]">
            <div className="flex justify-between items-start">
              <p className="text-[1rem] text-expresscash-textos font-bold">
                ¿Está seguro que desea eliminar este préstamo?
              </p>
              <p
                className="cursor-pointer mt-[6px]"
                onClick={() => {
                  setModalDelete(false); // Cerrar el modal al hacer clic en la X
                  setVisibleIndex(null); // Cerrar el menú de opciones
                }}
              >
                <IconX />
              </p>
            </div>
            <p className="text-[14px] font-book text-expresscash-gray w-[380px] mb-10 mt-1">
              Si elimina este préstamo no podrá recuperarlo.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  // Eliminar el préstamo al confirmar
                  if (visibleIndex !== null && user) {
                    handleDeletePrestamo(visibleIndex); // Llamamos a la función de eliminar préstamo
                  }
                  setModalDelete(false); // Cerrar el modal después de la eliminación
                  setVisibleIndex(null); // Cerrar el menú de opciones después de la eliminación
                }}
                className="bg-expresscash-red w-[109px] h-[38px] rounded-[5px] text-expresscash-white text-[1rem] font-book"
              >
                Eliminar
              </button>
              <button
                onClick={() => {
                  setModalDelete(false); // Cerrar el modal si se cancela
                  setVisibleIndex(null); // Cerrar el menú de opciones si se cancela
                }}
                className="border-[1px] border-solid border-expresscash-gray w-[109px] h-[38px] rounded-[5px] text-expresscash-gray text-[1rem] font-book"
              >
                Cancelar
              </button>
            </div>
          </div>
        }
      />

      {/* Modal para editar usuario */}
      {showUserEditModal && user && (
        <Modal
          isShown={showUserEditModal}
          closeModal={handleCloseUserEditModal}
          element={
            <EditUserModal
              user={transformUserToFormData(user)}
              onClose={handleCloseUserEditModal}
              onSave={handleEdit}
              setModalEdit={setShowUserEditModal} // Proporcionar setModalEdit
              getUsersList={function (): Promise<void> {
                throw new Error("Function not implemented.");
              }}
              onAddressChange={function (
                _field: keyof Address,
                _value: string | number
              ): void {
                throw new Error("Function not implemented.");
              }}
            />
          }
        />
      )}
    </div>
  );
};

export default UserDetailsModal;

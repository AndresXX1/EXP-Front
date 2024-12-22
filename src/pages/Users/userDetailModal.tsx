/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ArrowLeft, Mail, MoreVertical, Phone } from "lucide-react";
import React, { useState, useEffect } from "react";
import Modal from "@components/Modal";
import { EditUserModal } from "./editUserModal";
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
  user?: User;
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
  const [showPrestamoModal, setShowPrestamoModal] = useState(false);
  const [formData, setFormData] = useState<Prestamo | null>(null);
  const [modalDelete, setModalDelete] = useState(false);
  const [showUserEditModal, setShowUserEditModal] = useState(false);
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setVisibleIndex(null);
      }
    };
    if (visibleIndex !== null) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [visibleIndex]);

  const handleEditUser = () => {
    setShowUserEditModal(true);
  };

  const handleCloseUserEditModal = () => {
    setShowUserEditModal(false);
  };

  const handleClosePrestamoModal = () => {
    setShowPrestamoModal(false);
  };

  const handleSavePrestamo = () => {
    if (formData && user) {
      const updatedProducts = user.Prestamo.map(
        (prestamo: { numero: string }) =>
          prestamo.numero === formData.numero ? formData : prestamo
      );
      setShowPrestamoModal(false);
    }
  };

  const handleDeletePrestamo = (index: number) => {
    if (user) {
      const updatedProducts = user.Prestamo.filter(
        (_: any, i: number) => i !== index
      );
      onEdit({
        ...user,
        Prestamo: updatedProducts,
      });
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
    subscriptionStatus: "",
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
    event.stopPropagation();

    if (typeof index !== "number") return;

    const { clientX, clientY } = event;

    if (visibleIndex === index) {
      setVisibleIndex(null);
    } else {
      setMenuPosition({ top: clientY, left: clientX });
      setVisibleIndex(index);
    }
  };

  const handleEditPrestamo = (prestamo: Prestamo, _index: number) => {
    setFormData(prestamo);
    setShowPrestamoModal(true);
    setVisibleIndex(null);
  };

  return (
    <div className="flex flex-col bg-white p-6 max-w-8xl w-full min-h-[1400px] max-h-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="text-expresscash-textos hover:text-expresscash-black"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-4xl font-medium text-expresscash-textos font-poppins">
            {user.first_name} {user.last_name}
          </h1>
        </div>
        <button
          onClick={handleEditUser}
          className="px-4 py-2 bg-expresscash-skyBlue text-white rounded-lg hover:bg-opacity-90 font-poppins"
        >
          Editar usuario
        </button>
      </div>

      {/* Datos del cliente */}
      <div className="mb-12 mt-12">
        <h2 className="text-2xl font-medium text-expresscash-textos mb-12 font-poppins">
          Datos del cliente
        </h2>
        <div className="flex flex-wrap gap-[50px] mt-[20px] w-[1550px]">
          {/* Nombre y apellido */}
          <div className="flex items-center gap-4 w-full sm:w-1/4 md:w-1/5 px-[10px]">
            <div className="w-5 h-5 text-expresscash-textos font-poppins" />
            <div>
              <p className="text-sm text-expresscash-textos font-poppins">
                Nombre y apellido
              </p>
              <p className="text-expresscash-textos font-poppins font-bold">
                {user.first_name} {user.last_name}
              </p>
            </div>
          </div>

          {/* Documento / ID */}
          <div className="flex items-center gap-4 w-full sm:w-1/4 md:w-1/5 px-[10px] ml-[20px]">
            <div className="w-5 h-5 flex items-center justify-center text-expresscash-textos">
              <span className="text-sm font-medium font-poppins">ID</span>
            </div>
            <div>
              <p className="text-sm text-expresscash-textos font-poppins">
                Documento
              </p>
              <p className="text-expresscash-textos font-poppins font-bold">
                {user.dni}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4 w-full sm:w-1/4 md:w-1/5 px-[10px] ml-[20px] ">
            <Mail className="w-5 h-5 text-expresscash-textos" />
            <div>
              <p className="text-sm text-expresscash-textos font-poppins font-bold">
                Email
              </p>
              <p className="text-expresscash-skyBlue font-poppins">
                {user.email}
              </p>
            </div>
          </div>

          {/* Teléfono */}
          <div className="flex items-center gap-4 w-full sm:w-1/4 md:w-1/5 px-[10px] ml-[10px]">
            <Phone className="w-5 h-5 text-expresscash-textos font-poppins" />
            <div>
              <p className="text-sm text-expresscash-textos font-poppins font-bold">
                Teléfono
              </p>
              <p className="text-expresscash-skyBlue font-poppins">
                {user.phone}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de préstamos */}
      <div>
        <h2 className="text-2xl font-medium text-expresscash-textos mb-8 mt-5 font-poppins">
          Préstamos
        </h2>
        {/* Verificar si el array de préstamos está vacío */}
        {user.Prestamo.length === 0 ? (
          <>
            <div className="translate-x-[190px]">
              <div className="ml-[370px] mt-[150px]">
                {/* <IconProductsBig /> */}
              </div>
              <p className="text-center text-expresscash-textos font-poppins">
                Este cliente no ha sacado ningún préstamo aún
              </p>
            </div>
          </>
        ) : (
          <div className="overflow-x-auto w-[1320px] h-[500px] translate-x-[0px]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-expresscash-gray">
                  <th className="text-center py-3 px-4 min-w-[200px] text-expresscash-textos font-bold font-poppins">
                    Número
                  </th>
                  <th className="text-center py-3 px-4 min-w-[200px] text-expresscash-textos font-bold font-poppins">
                    Fecha
                  </th>
                  <th className="text-center py-3 px-4 min-w-[200px] text-expresscash-textos font-bold font-poppins">
                    Monto
                  </th>
                  <th className="text-center py-3 px-4 min-w-[200px] text-expresscash-textos font-bold font-poppins">
                    Estado del pago
                  </th>
                  <th className="text-center py-3 px-4 min-w-[200px] text-expresscash-textos font-bold font-poppins">
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
                    }`}
                  >
                    <td className="py-10 px-16 text-center text-expresscash-skyBlue min-w-[200px] font-poppins">
                      {prestamo.numero}
                    </td>
                    <td className="py-10 px-16 text-center text-expresscash-textos min-w-[200px] font-poppins">
                      {prestamo.fecha}
                    </td>
                    <td className="py-10 px-16 text-center text-expresscash-textos min-w-[200px] font-poppins">
                      ${prestamo.monto}
                    </td>
                    <td className="py-10 px-16 text-center font-poppins">
                      <span
                        className={`text-sm font-medium min-w-[200px] font-poppins ${
                          prestamo.estado_pago === "pagado"
                            ? "text-expresscash-green"
                            : prestamo.estado_pago === "en mora"
                              ? "text-expresscash-red"
                              : prestamo.estado_pago === "en proceso"
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
                                setModalDelete(true);
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
              <h2 className="text-2xl text-expresscash-textos font-bold mb-6 font-poppins">
                Editar préstamo
              </h2>
              <div className="space-y-4">
                <label className="text-sm text-expresscash-textos font-poppins font-bold block">
                  Prestamo número:
                </label>
                <label className="text-sm text-expresscash-skyBlue font-poppins">
                  {"    " + formData.numero}
                </label>
              </div>
              <div className="space-y-4">
                <label className="text-sm text-expresscash-textos block font-poppins font-bold">
                  Fecha
                </label>
                <div className="font-poppins">{formData.fecha}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-expresscash-textos block font-poppins font-bold">
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
                  className="p-2 w-full border border-expresscash-gray3 rounded-lg font-poppins"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-expresscash-textos block font-poppins font-bold">
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
                  className="p-2 w-full border border-expresscash-gray3 rounded-lg font-poppins"
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
                  className="bg-expresscash-skyBlue text-white rounded-lg px-6 py-2 font-poppins font-bold"
                >
                  Guardar
                </button>
                <button
                  onClick={handleClosePrestamoModal}
                  className="text-expresscash-redDark hover:text-expresscash-redDark font-poppins font-bold"
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
          setModalDelete(false);
          setVisibleIndex(null);
        }}
        element={
          <div className="px-6 py-6 flex flex-col justify-center w-[481px] h-[192px]">
            <div className="flex justify-between items-start">
              <p className="text-[1rem] text-expresscash-textos font-poppins">
                ¿Está seguro que desea eliminar este préstamo?
              </p>
              <p
                className="cursor-pointer mt-[6px]"
                onClick={() => {
                  setModalDelete(false);
                  setVisibleIndex(null);
                }}
              >
                <IconX />
              </p>
            </div>
            <p className="text-[14px] font-poppins text-expresscash-gray w-[380px] mb-10 mt-1">
              Si elimina este préstamo no podrá recuperarlo.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (visibleIndex !== null && user) {
                    handleDeletePrestamo(visibleIndex);
                  }
                  setModalDelete(false);
                  setVisibleIndex(null);
                }}
                className="bg-expresscash-red w-[109px] h-[38px] rounded-[5px] text-expresscash-white text-[1rem] font-poppins"
              >
                Eliminar
              </button>
              <button
                onClick={() => {
                  setModalDelete(false);
                  setVisibleIndex(null);
                }}
                className="border-[1px] border-solid border-expresscash-gray w-[109px] h-[38px] rounded-[5px] text-expresscash-gray text-[1rem] font-poppins"
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
              setModalEdit={setShowUserEditModal}
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

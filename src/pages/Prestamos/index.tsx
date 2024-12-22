/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  MailIcon,
  MoreVertical,
  Search,
  UserPlus,
} from "lucide-react";
import { FaCopy, FaWhatsapp } from "react-icons/fa";
import React, { useState, useRef, useEffect } from "react";
import LoanDetails from "./prestamoDetail";
import { User, Prestamo } from "../../store/types/user";
import CreateUserModal from "../Users/createUserForm";

const Modal: React.FC<{
  isShown: boolean;
  closeModal: () => void;
  element: React.ReactNode;
}> = ({ isShown, closeModal, element }) => {
  if (!isShown) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={closeModal}
        >
          X
        </button>
        {element}
      </div>
    </div>
  );
};

export default function LoansTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(1);
  const [selectedLoan, setSelectedLoan] = useState<Prestamo | null>(null);
  const [isModalOpenWhatsapp, setIsModalOpenWhatsapp] = useState(false);
  const [isModalOpenEmail, setIsModalOpenEmail] = useState(false);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPrestamoModal, setShowPrestamoModal] = useState(false);
  const [formData, setFormData] = useState<Prestamo | null>(null);
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState<{
    [key: number]: boolean;
  }>({});
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const actionsMenuRef = useRef<HTMLDivElement | null>(null);

  const users: User[] = [
    {
      id: 1,
      first_name: "Andres",
      last_name: "Vera",
      phone: "3511425568",
      address: [],
      dni: "39690691",
      email: "andres@hotmail.com",
      status: "activo",
      Prestamo: [
        {
          numero: "#512",
          fecha: "11/12/2024",
          monto: 12313,
          estado_pago: "",
          status: "al_dia",
        },
        {
          numero: "#513",
          fecha: "10/11/2024",
          monto: 4500,
          estado_pago: "",
          status: "pendiente",
        },
      ],
      totalLoaned: 16813,
      last_login: "",
      create: "",
      image: "",
      subscription_status: "",
      birthday: "",
      points: 0,
      cuponizate: false,
      avatar: "",
      gender: "",
      cuil: "",
      bank: "",
      paymentDate: "",
      prestamo: [],
    },
    {
      id: 2,
      first_name: "Andres",
      last_name: "Vera",
      phone: "3511425568",
      address: [],
      dni: "39690691",
      email: "andres2@hotmail.com",
      totalLoaned: 0,
      status: "pendiente",
      Prestamo: [],
      last_login: "",
      create: "",
      image: "",
      subscription_status: "",
      birthday: "",
      points: 0,
      cuponizate: false,
      avatar: "",
      gender: "",
      cuil: "",
      bank: "",
      paymentDate: "",
      prestamo: [],
    },
  ];
  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionsMenuRef.current &&
        !actionsMenuRef.current.contains(event.target as Node)
      ) {
        setIsActionsMenuOpen({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggleActionsMenu = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    userId: number,
    _index?: number
  ) => {
    setMenuPosition({ top: event.clientY, left: event.clientX });
    setIsActionsMenuOpen(prevState => {
      const newState = Object.keys(prevState).reduce(
        (acc, key) => {
          acc[parseInt(key)] = false;
          return acc;
        },
        {} as { [key: number]: boolean }
      );

      newState[userId] = !prevState[userId];
      return newState;
    });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleCloseLoanDetails = () => {
    setSelectedLoan(null);
  };

  const handleOpenMailModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpenEmail(true);
  };

  const handleCloseMailModal = () => setIsModalOpenEmail(false);

  const handleOpenWhatsappModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpenWhatsapp(true);
  };

  const handleCloseWhatsappModal = () => setIsModalOpenWhatsapp(false);

  const handleEditLoan = (loan: Prestamo) => {
    setFormData(loan);
    setShowPrestamoModal(true);
  };

  const handleClosePrestamoModal = () => {
    setShowPrestamoModal(false);
    setFormData(null);
  };

  const handleSavePrestamo = (_event?: React.MouseEvent<HTMLButtonElement>) => {
    if (formData) {
      console.log("Saving changes in the loan:", formData);
      handleClosePrestamoModal();
    }
  };

  const handleOpenLoanDetails = (user: User, loanIndex: number) => {
    if (user.Prestamo && user.Prestamo[loanIndex]) {
      const loan = user.Prestamo[loanIndex];
      setSelectedLoan(loan);
      setSelectedUser(user);
    } else {
      console.error("No loan found at index", loanIndex);
    }
  };

  return (
    <div className="flex flex-col pl-18 pt-12 px-[40px] max-w-[clamp(1300px,67.2vw,1200px)] min-h-[800px] max-h-[1300px] bg-[white]">
      {selectedLoan === null ? (
        <>
          <div className="flex gap-2 mb-2">
            <p className="text-[3rem] text-expresscash-textos font-poppins ">
              Préstamos
            </p>
            <p className="text-[40px] text-expresscash-textos font-poppins mt-[6px]">
              ({users.length})
            </p>
          </div>

          <div className="flex flex-col pl-[780px] translate-y-[-70px] text-expresscash-white translate-x-[125px]">
            <button
              className="border border-expresscash-skyBlue font-poppins border-solid border-1 rounded-lg bg-expresscash-skyBlue h-[40px] w-[240px] flex items-center justify-center gap-2"
              onClick={openModal}
            >
              <UserPlus className="w-8 h-5" />
              <span>Agregar nuevo cliente</span>
            </button>
          </div>

          <div className="flex justify-between mb-8">
            <div className="relative flex">
              <input
                className="w-[457px] h-[54px] rounded-[13px] border-[1px] border-argenpesos-textos border-solid px-10 placeholder:text-argenpesos-textos font-poppins text-argenpesos-textos text-[15.36px]"
                type="search"
                placeholder="Buscar préstamos por nombre, email, teléfono o número de préstamo"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <Search className="absolute top-[18px] left-4" />
            </div>
            <div className="flex gap-10">
              <button onClick={handlePrevPage} disabled={currentPage === 1}>
                <ArrowLeft />
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <ArrowRight />
              </button>
            </div>
          </div>

          {/* Solicitudes de Préstamos Pendientes */}
          <div>
            <div className="text-expresscash-textos text-[26px] text-left truncate mb-[50px] underline font-poppins">
              Solicitudes de Préstamo Pendientes
            </div>
            <div className="grid grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)] gap-10 items-center">
              {/* Encabezados de la tabla */}
              <div className="text-center truncate font-poppins font-bold text-expresscash-textos">
                Último préstamo
              </div>
              <div className="font-bold font-poppins text-expresscash-textos text-center truncate">
                Total Prestado
              </div>
              <div className="font-bold font-poppins text-expresscash-textos text-center truncate">
                Nombre
              </div>
              <div className="font-bold font-poppins text-expresscash-textos text-center truncate">
                Contactar
              </div>
              <div className="font-bold font-poppins text-expresscash-textos text-center truncate">
                Estado del Préstamo
              </div>
              <div className="font-poppins font-bold text-expresscash-textos text-center truncate">
                Acciones
              </div>
              <div className="col-span-6 border-t border-gray-300"></div>

              {users
                .filter(
                  user =>
                    user.Prestamo.some(
                      (prestamo: { status: string }) =>
                        prestamo.status === "pendiente"
                    ) &&
                    (user.first_name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                      user.last_name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      user.email
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      user.dni.includes(searchQuery))
                )
                .map((user, index) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)] gap-10 items-center"
                  >
                    {/* Último préstamo - Clickeable */}
                    <div
                      className="text-center cursor-pointer text-expresscash-skyBlue hover:underline font-poppins"
                      onClick={() => handleOpenLoanDetails(user, 0)}
                    >
                      {
                        user.Prestamo.find(
                          (p: { status: string }) => p.status === "pendiente"
                        )?.numero
                      }
                    </div>

                    {/* Total prestado - Clickeable */}
                    <div className="text-center font-poppins">
                      {user.totalLoaned}
                    </div>

                    {/* Nombre del usuario - Clickeable */}
                    <div className="text-center text-expresscash-text font-poppins translate-x-[20px]">
                      {`${user.first_name} ${user.last_name}`}
                    </div>

                    {/* Botones para contactar */}
                    <div className="text-center translate-x-[40px]">
                      <button onClick={() => handleOpenWhatsappModal(user)}>
                        <FaWhatsapp className="w-6 h-6 text-green-500" />
                      </button>
                      <button onClick={() => handleOpenMailModal(user)}>
                        <Mail className="w-6 ml-[20px] h-6 text-black-500" />
                      </button>
                    </div>

                    {/* Estado del préstamo */}
                    <div className="text-center font-poppins translate-x-[40px]">
                      {
                        user.Prestamo.find(
                          (p: { status: string }) => p.status === "pendiente"
                        )?.status
                      }
                    </div>

                    {/* Menú de acciones */}
                    <div className="text-center translate-x-[60px]">
                      <div className="flex justify-center relative">
                        <button
                          className="p-2 rounded-full hover:bg-gray-100"
                          onClick={event =>
                            handleToggleActionsMenu(event, user.id, index)
                          }
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        {isActionsMenuOpen[user.id] && menuPosition && (
                          <div
                            ref={actionsMenuRef}
                            className="absolute z-10 transition-all duration-200 ease-in-out opacity-100 max-h-[90px] bg-expresscash-white border-[1px] border-solid border-expresscash-gray rounded-[7px] w-[158px]"
                            style={{
                              top: `${menuPosition.top - 440}px`,
                              left: `${menuPosition.left - 1510}px`,
                            }}
                          >
                            <div className="flex flex-col w-full gap-3 items-center justify-center h-full">
                              <p
                                onClick={e => {
                                  e.stopPropagation();
                                  handleEditLoan(user.Prestamo[0]);
                                }}
                                className="flex items-center mr-7 cursor-pointer hover:bg-gray-200 p-2 rounded-lg"
                              >
                                Editar
                              </p>
                              <div
                                onClick={e => {
                                  e.stopPropagation();
                                  setSelectedUser(user);
                                  setModalDelete(true);
                                }}
                                className="flex items-center mr-2 cursor-pointer translate-y-[-10px] hover:bg-gray-200 p-2 rounded-lg"
                              >
                                Eliminar
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          {/* Modal de Bloqueo */}
          {modalDelete && users?.some(user => user.id === selectedUser?.id) && (
            <Modal
              isShown={modalDelete}
              closeModal={() => setModalDelete(false)}
              element={
                <div className="flex flex-col justify-center">
                  <div className="flex justify-between items-start">
                    <p className="text-[1rem] text-expresscash-textos font-poppins">
                      ¿Está seguro que desea eliminar este préstamo?
                    </p>
                  </div>
                  <p className="text-[14px] font-poppins text-expresscash-gray w-[380px] mb-10 mt-1">
                    Si elimina este préstamo no podrá recuperarlo.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        // Eliminar el préstamo al confirmar
                        if (visibleIndex !== null && users) {
                          handleSavePrestamo();
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
          )}

          {/* Historial de Préstamos */}
          <div className="mt-12">
            <div className="text-expresscash-textos text-[25px] text-left truncate mb-[60px] mt-[50px] underline font-poppins">
              Historial de Préstamos
            </div>
            <div className="grid grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)] gap-10 items-center">
              {users
                .filter(
                  user =>
                    user.Prestamo.some(
                      (prestamo: { status: string }) =>
                        prestamo.status !== "pendiente"
                    ) &&
                    (user.first_name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                      user.last_name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      user.email
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      user.dni.includes(searchQuery))
                )
                .map((user, index) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)] gap-10 items-center"
                  >
                    {/* Último préstamo - Clickeable */}
                    <div
                      className="text-center cursor-pointer text-expresscash-skyBlue hover:underline font-poppins"
                      onClick={() => handleOpenLoanDetails(user, 0)} // Muestra el primer préstamo no pendiente
                    >
                      {
                        user.Prestamo.find(
                          (p: { status: string }) => p.status !== "pendiente"
                        )?.numero
                      }
                    </div>

                    {/* Total prestado - Clickeable */}
                    <div className="text-center font-poppins">
                      {user.totalLoaned}
                    </div>

                    {/* Nombre del usuario - Clickeable */}
                    <div className="text-center text-expresscash-text font-poppins translate-x-[20px]">
                      {`${user.first_name} ${user.last_name}`}
                    </div>

                    {/* Botones para contactar */}
                    <div className="text-center translate-x-[40px]">
                      <button onClick={() => handleOpenWhatsappModal(user)}>
                        <FaWhatsapp className="w-6 h-6 text-green-500" />
                      </button>
                      <button onClick={() => handleOpenMailModal(user)}>
                        <Mail className="w-6 h-6 ml-[20px] text-black-500" />
                      </button>
                    </div>

                    {/* Estado del préstamo */}
                    <div className="text-center font-poppins translate-x-[40px]">
                      {
                        user.Prestamo.find(
                          (p: { status: string }) => p.status !== "pendiente"
                        )?.status
                      }
                    </div>

                    {/* Menú de acciones */}
                    <div className="text-center translate-x-[60px]">
                      <div className="flex justify-center relative">
                        <button
                          className="p-2 rounded-full hover:bg-gray-100"
                          onClick={event =>
                            handleToggleActionsMenu(event, user.id, index)
                          }
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="col-span-5 border-t border-gray-300"></div>
                  </div>
                ))}
            </div>
          </div>

          {/* Modal de Crear Usuario */}
          <Modal
            isShown={isModalOpen}
            closeModal={closeModal}
            element={
              <CreateUserModal
                onClose={closeModal}
                onSave={formData => {
                  console.log(formData);
                  closeModal();
                }}
              />
            }
          />

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

          {/* Modales de WhatsApp y Email */}
          {selectedUser && (
            <>
              {/* Modal de WhatsApp */}
              <Modal
                isShown={isModalOpenWhatsapp}
                closeModal={handleCloseWhatsappModal}
                element={
                  <div className="w-[490px] h-[320px] p-10 relative">
                    {selectedUser && (
                      <>
                        <h3 className="text-2xl font-bold mb-16 font-poppins text-expresscash-textos">
                          Contacto WhatsApp de {selectedUser.first_name}
                        </h3>

                        {/* Teléfono con icono de copiar */}
                        <div className="flex items-center mb-[70px] ml-5 translate-x-20">
                          <p className="mr-2 text-lg">{selectedUser.phone}</p>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(selectedUser.phone);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 6000);
                            }}
                            className="ml-4 text-expresscash-skyBlue hover:text-expresscash-blue flex items-center"
                          >
                            <FaCopy className="w-5 h-5 mr-2" />
                            {copied ? (
                              <span className="text-expresscash-skyBlue font-semibold">
                                Copiado!
                              </span>
                            ) : (
                              <span>Copiar</span>
                            )}
                          </button>
                        </div>

                        {/* Botón de WhatsApp */}
                        <a
                          href={`https://wa.me/${selectedUser.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center bg-green-500 text-white rounded-lg p-4 hover:bg-green-600 transition duration-300"
                        >
                          <FaWhatsapp className="w-6 h-6 mr-2" />
                          Enviar mensaje
                        </a>
                      </>
                    )}
                  </div>
                }
              />

              {/* Modal de Email */}
              <Modal
                isShown={isModalOpenEmail}
                closeModal={handleCloseMailModal}
                element={
                  <div className="w-[490px] h-[320px] p-10 relative">
                    {selectedUser && (
                      <>
                        <h3 className="text-2xl font-bold mb-16 font-poppins text-expresscash-textos">
                          Contacto por Email de {selectedUser.first_name}
                        </h3>

                        <div className="flex items-center mb-20 ml-[50px]">
                          <p className="mr-2 text-lg font-poppins font-bold">
                            {" "}
                            {selectedUser.email}
                          </p>

                          {/* Botón para copiar el correo */}
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(selectedUser.email);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 6000);
                            }}
                            className="ml-4 text-expresscash-skyBlue hover:text-expresscash-blue flex items-center"
                          >
                            <FaCopy className="w-5 h-5 mr-2" />
                            {copied ? (
                              <span className="text-expresscash-skyBlue font-semibold">
                                Copiado!
                              </span>
                            ) : (
                              <span>Copiar</span>
                            )}
                          </button>
                        </div>

                        {/* Enlace para enviar correo, con asunto predefinido */}
                        <a
                          href={`mailto:${selectedUser.email}?subject=Consulta&body=Hola,%20tengo%20una%20pregunta.`}
                          className="inline-flex items-center text-white bg-blue-500 p-3 rounded-lg hover:bg-blue-600 transition duration-300 w-[400px] ml-2"
                        >
                          <MailIcon className="w-6 h-5 mr-2 ml-[70px]" /> Enviar
                          Email desde Gmail
                        </a>
                      </>
                    )}
                  </div>
                }
              />
            </>
          )}
        </>
      ) : (
        <div className="flex flex-col space-y-6">
          <button
            className="text-expresscash-skyBlue"
            onClick={handleCloseLoanDetails}
          >
            <ArrowLeft />
          </button>

          <LoanDetails
            loanNumber={selectedLoan?.numero?.toString() || ""}
            status="al_dia"
            installments={{ paid: 5, total: 15 }}
            amounts={{
              paid: selectedLoan?.monto || 0,
              remaining: 4500,
              total: selectedLoan?.monto || 0,
            }}
            payment={{
              status: "Pago en proceso",
              method: "Tarjeta",
              subtotal: selectedLoan?.monto || 0,
              shippingCost: 0,
              total: selectedLoan?.monto || 0,
            }}
            client={{
              name: `${selectedUser!.first_name} ${selectedUser!.last_name}`,
              email: selectedUser!.email,
              phone: selectedUser!.phone,
              id: selectedUser!.dni,
              prestamos: selectedUser!.Prestamo || [],
            }}
          />
        </div>
      )}
    </div>
  );
}

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
// Inline Modal component
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
  const [showPrestamoModal, setShowPrestamoModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [formData, setFormData] = useState<Prestamo | null>(null);
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState<{
    [key: number]: boolean;
  }>({});

  // Variables para manejar el índice visible y la posición del menú
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null); // Índice visible
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null); // Posición del menú
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
  const closeModal = () => setIsModalOpen(false); // Función para cerrar el modal
  const openModal = () => setIsModalOpen(true);
  // Detectar clics fuera del menú de acciones
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
    index?: number
  ) => {
    setMenuPosition({ top: event.clientY, left: event.clientX });
    setIsActionsMenuOpen(prevState => {
      // Solo abre el menú para este usuario específico
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
    setFormData(loan); // Establece los datos del préstamo seleccionado en el estado formData
    setShowPrestamoModal(true); // Muestra el modal de edición
  };

  const handleClosePrestamoModal = () => {
    setShowPrestamoModal(false); // Cierra el modal
    setFormData(null); // Limpia los datos del préstamo
  };

  const handleSavePrestamo = (_event?: React.MouseEvent<HTMLButtonElement>) => {
    if (formData) {
      console.log("Saving changes in the loan:", formData);
      // Add logic to save the changes here
      handleClosePrestamoModal(); // Close the modal after saving
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

  function handleConfirmDelete(id: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex flex-col pl-18 pt-12 px-[40px] max-w-[clamp(1000px,67.2vw,1200px)]">
      {selectedLoan === null ? (
        <>
          <div className="flex gap-2 mb-2">
            <p className="text-[3rem] text-expresscash-textos font-bold">
              Préstamos
            </p>
            <p className="text-[40px] text-expresscash-textos font-book mt-[6px]">
              ({users.length})
            </p>
          </div>

          <div className="flex flex-col pl-[780px] translate-y-[-70px] text-expresscash-white translate-x-[125px]">
            <button
              className="border border-expresscash-skyBlue border-solid border-1 rounded-lg bg-expresscash-skyBlue h-[40px] w-[240px] flex items-center justify-center gap-2"
              onClick={openModal} // Abrir el modal cuando se haga clic
            >
              <UserPlus className="w-8 h-5" />
              <span>Agregar nuevo cliente</span>
            </button>
          </div>

          <div className="flex justify-between mb-8">
            <div className="relative flex">
              <input
                className="w-[457px] h-[54px] rounded-[13px] border-[1px] border-argenpesos-textos border-solid px-10 placeholder:text-argenpesos-textos font-book text-argenpesos-textos text-[15.36px]"
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
            <div className="text-expresscash-textos text-[26px] text-left truncate mb-[50px]">
              Solicitudes de Préstamo Pendientes
            </div>
            <div className="grid grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)] gap-10 items-center">
              {/* Encabezados de la tabla */}
              <div className="font-bold text-center truncate">
                Último préstamo
              </div>
              <div className="font-bold text-center truncate">
                Total Prestado
              </div>
              <div className="font-bold text-center truncate">Nombre</div>
              <div className="font-bold text-center truncate">Contactar</div>
              <div className="font-bold text-center truncate">
                Estado del Préstamo
              </div>
              <div className="font-bold text-center truncate">Acciones</div>
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
                      className="text-center cursor-pointer text-expresscash-skyBlue hover:underline"
                      onClick={() => handleOpenLoanDetails(user, 0)} // Muestra el primer préstamo pendiente
                    >
                      {
                        user.Prestamo.find(
                          (p: { status: string }) => p.status === "pendiente"
                        )?.numero
                      }
                    </div>

                    {/* Total prestado - Clickeable */}
                    <div className="text-center">{user.totalLoaned}</div>

                    {/* Nombre del usuario - Clickeable */}
                    <div
                      className="text-center cursor-pointer text-expresscash-skyBlue hover:underline"
                      onClick={() => handleOpenLoanDetails(user, 0)}
                    >
                      {`${user.first_name} ${user.last_name}`}
                    </div>

                    {/* Botones para contactar */}
                    <div className="text-center">
                      <button onClick={() => handleOpenWhatsappModal(user)}>
                        <FaWhatsapp className="w-6 h-6 text-green-500" />
                      </button>
                      <button onClick={() => handleOpenMailModal(user)}>
                        <Mail className="w-6 ml-[20px] h-6 text-black-500" />
                      </button>
                    </div>

                    {/* Estado del préstamo */}
                    <div className="text-center">
                      {
                        user.Prestamo.find(
                          (p: { status: string }) => p.status === "pendiente"
                        )?.status
                      }
                    </div>

                    {/* Menú de acciones */}
                    <div className="text-center">
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
                                  handleEditLoan(user.Prestamo[0]); // Pasa el primer préstamo pendiente para editar
                                }}
                                className="flex items-center mr-7 cursor-pointer hover:bg-gray-200 p-2 rounded-lg"
                              >
                                Editar
                              </p>
                              <div
                                onClick={e => {
                                  e.stopPropagation();
                                  setSelectedUser(user); // Asegúrate de seleccionar el usuario
                                  setModalDelete(true); // Abre el modal de bloqueo
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
              closeModal={() => setModalDelete(false)} // Cierra el modal
              element={
                <div className="flex flex-col justify-center">
                  <div className="flex justify-between items-start">
                    <p className="text-[1rem] text-expresscash-textos font-bold">
                      ¿Está seguro que desea eliminar este préstamo?
                    </p>
                  </div>
                  <p className="text-[14px] font-book text-expresscash-gray w-[380px] mb-10 mt-1">
                    Si elimina este préstamo no podrá recuperarlo.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        // Eliminar el préstamo al confirmar
                        if (visibleIndex !== null && users) {
                          handleSavePrestamo(); // Llamamos a la función de eliminar préstamo
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
          )}

          {/* Historial de Préstamos */}
          <div className="mt-12">
            <div className="text-expresscash-textos text-[25px] text-left truncate mb-[60px] mt-[50px]">
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
                      className="text-center cursor-pointer text-expresscash-skyBlue hover:underline"
                      onClick={() => handleOpenLoanDetails(user, 0)} // Muestra el primer préstamo no pendiente
                    >
                      {
                        user.Prestamo.find(
                          (p: { status: string }) => p.status !== "pendiente"
                        )?.numero
                      }
                    </div>

                    {/* Total prestado - Clickeable */}
                    <div className="text-center">{user.totalLoaned}</div>

                    {/* Nombre del usuario - Clickeable */}
                    <div
                      className="text-center cursor-pointer text-expresscash-skyBlue hover:underline"
                      onClick={() => handleOpenLoanDetails(user, 0)}
                    >
                      {`${user.first_name} ${user.last_name}`}
                    </div>

                    {/* Botones para contactar */}
                    <div className="text-center">
                      <button onClick={() => handleOpenWhatsappModal(user)}>
                        <FaWhatsapp className="w-6 h-6 text-green-500" />
                      </button>
                      <button onClick={() => handleOpenMailModal(user)}>
                        <Mail className="w-6 h-6 ml-[20px] text-black-500" />
                      </button>
                    </div>

                    {/* Estado del préstamo */}
                    <div className="text-center">
                      {
                        user.Prestamo.find(
                          (p: { status: string }) => p.status !== "pendiente"
                        )?.status
                      }
                    </div>

                    {/* Menú de acciones */}
                    <div className="text-center">
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
            isShown={isModalOpen} // Solo se mostrará cuando isModalOpen sea true
            closeModal={closeModal} // Función para cerrar el modal
            element={
              <CreateUserModal
                onClose={closeModal} // Cierra el modal al hacer click en el botón de cerrar
                onSave={formData => {
                  // Lógica para guardar el nuevo cliente, puedes usar el formData aquí
                  console.log(formData);
                  closeModal(); // Cierra el modal después de guardar
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

          {/* Modales de WhatsApp y Email */}
          {selectedUser && (
            <>
              {/* Modal de WhatsApp */}
              <Modal
                isShown={isModalOpenWhatsapp}
                closeModal={handleCloseWhatsappModal}
                element={
                  <div className="w-[490px] h-[320px] p-10 relative">
                    {/* Botón para cerrar el modal */}

                    {selectedUser && (
                      <>
                        {/* Título con separación */}
                        <h3 className="text-2xl font-semibold mb-16">
                          Contacto WhatsApp de {selectedUser.first_name}
                        </h3>

                        {/* Teléfono con icono de copiar */}
                        <div className="flex items-center mb-[70px] ml-5">
                          <p className="mr-2 text-lg">
                            Teléfono: {selectedUser.phone}
                          </p>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(selectedUser.phone); // Copiar teléfono al portapapeles
                              setCopied(true); // Mostrar mensaje de "copiado"
                              setTimeout(() => setCopied(false), 6000); // Eliminar mensaje después de 2 segundos
                            }}
                            className="ml-4 text-expresscash-skyBlue hover:text-expresscash-blue flex items-center"
                          >
                            <FaCopy className="w-5 h-5 mr-2" />
                            {copied ? (
                              <span className="text-expresscash-skyBlue font-semibold">
                                Copiado!
                              </span> // Mensaje de confirmación
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
                    {/* Botón para cerrar el modal */}

                    {selectedUser && (
                      <>
                        {/* Título y dirección de correo */}
                        <h3 className="text-2xl font-semibold mb-16">
                          Contacto por Email de {selectedUser.first_name}
                        </h3>

                        <div className="flex items-center mb-20 ml-[50px]">
                          <p className="mr-2 text-lg"> {selectedUser.email}</p>

                          {/* Botón para copiar el correo */}
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(selectedUser.email); // Copiar correo al portapapeles
                              setCopied(true); // Mostrar mensaje de "copiado"
                              setTimeout(() => setCopied(false), 6000); // Eliminar mensaje después de 2 segundos
                            }}
                            className="ml-4 text-expresscash-skyBlue hover:text-expresscash-blue flex items-center"
                          >
                            <FaCopy className="w-5 h-5 mr-2" />
                            {copied ? (
                              <span className="text-expresscash-skyBlue font-semibold">
                                Copiado!
                              </span> // Mensaje de confirmación
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
                          <MailIcon className="w-6 h-5 mr-2 ml-[70px]" />{" "}
                          {/* Icono con margen derecho para separación */}
                          Enviar Email desde Gmail
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

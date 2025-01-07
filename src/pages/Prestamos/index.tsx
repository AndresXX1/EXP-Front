/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  MoreVertical,
  UserPlus,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import React, { useState, useRef, useEffect, useMemo } from "react";
import LoanDetails from "./prestamoDetail";
import { User, Prestamo } from "../../store/types/user";
import CreateLoanRequestModal from "./createLoanRequest";
import { Check } from "lucide-react";
import { X } from "lucide-react";
import { IconFilter, IconMagnifyingGlass } from "@utils/svg";

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
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPrestamoModal, setShowPrestamoModal] = useState(false);
  const [formData, setFormData] = useState<Prestamo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState<{
    [key: string]: boolean;
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
      first_name: "Andresss",
      last_name: "Vera",
      phone: "3511425568",
      address: [],
      dni: "39690691",
      email: "andres@hotmail.com",
      status: "activo",
      score: 612,
      zip_code: "z5003",
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
      first_name: "Carlos",
      last_name: "Vera",
      phone: "3511425568",
      zip_code: "z5006",
      address: [],
      dni: "39690691",
      score: 512,
      email: "andres2@hotmail.com",
      totalLoaned: 0,
      status: "pendiente",
      Prestamo: [
        {
          numero: "#514",
          fecha: "10/11/2024",
          monto: 4500,
          estado_pago: "",
          status: "pendiente",
        },
      ],
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
    prestamoNumero: string
  ) => {
    setMenuPosition({ top: event.clientY, left: event.clientX });
    setIsActionsMenuOpen(prevState => ({
      ...prevState,
      [prestamoNumero]: !prevState[prestamoNumero],
    }));
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

  const handleOpenLoanDetails = (user: User | undefined, loanIndex: number) => {
    if (user && user.Prestamo && user.Prestamo[loanIndex]) {
      const loan = user.Prestamo[loanIndex];
      setSelectedLoan(loan);
      setSelectedUser(user);
    } else {
      console.error("No loan or user found at index", loanIndex);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setIsAllChecked(checked);
    setSelectedUsers(checked ? users.map(user => user.id) : []);
  };

  const handleCheck = (userId: number, checked: boolean) => {
    setSelectedUsers(prevSelected =>
      checked
        ? [...prevSelected, userId]
        : prevSelected.filter(id => id !== userId)
    );
    setIsAllChecked(users.length === selectedUsers.length + (checked ? 1 : -1));
  };

  const countTotalLoans = () => {
    return users.reduce((total, user) => total + user.Prestamo.length, 0);
  };

  const filteredUsers = users.filter(user => {
    // Filtrar los usuarios que coinciden con el `searchQuery`
    const userSearchString =
      `${user.first_name} ${user.last_name} ${user.email} ${user.phone} ${user.address.join(" ")}`.toLowerCase();
    return userSearchString.includes(searchQuery.toLowerCase());
  });

  // Luego dentro de los usuarios filtrados, filtras los préstamos:
  const filteredLoans = useMemo(() => {
    return filteredUsers
      .map(user => {
        const filteredPrestamos = user.Prestamo.filter(
          (prestamo: { numero: any; fecha: any; monto: any }) => {
            const prestamoSearchString =
              `${prestamo.numero} ${prestamo.fecha} ${prestamo.monto}`.toLowerCase();
            return prestamoSearchString.includes(searchQuery.toLowerCase());
          }
        );

        return { ...user, Prestamo: filteredPrestamos };
      })
      .filter(user => user.Prestamo.length > 0); // Filtrar usuarios que tienen préstamos visibles
  }, [searchQuery, filteredUsers]); // Dependencias ajustadas para recalcular cuando cambia el filtro

  return (
    <div className="flex flex-col pl-18 pt-12 px-[40px] max-w-[clamp(1600px,67.2vw,1600px)] min-h-[800px] max-h-[1300px] bg-[white]">
      {selectedLoan === null ? (
        <>
          <div className="flex gap-2 mb-2">
            <p className="text-[3rem] text-expresscash-textos font-poppins ">
              Solicitudes de préstamos
            </p>
            <p className="text-[40px] text-expresscash-textos font-poppins mt-[6px]">
              ({countTotalLoans()})
            </p>
          </div>

          <div className="flex flex-col pl-[780px] translate-y-[-70px] text-expresscash-white translate-x-[125px]">
            <button
              className="border border-expresscash-skyBlue font-poppins border-solid border-1 rounded-lg bg-expresscash-skyBlue h-[40px] w-[240px] flex items-center justify-center gap-2"
              onClick={openModal}
            >
              <UserPlus className="w-8 h-5" />
              <span>Nueva solicitud</span>
            </button>
          </div>

          <div className="flex justify-between mb-10">
            <div className="relative flex">
              <input
                className="w-[457px] h-[54px] rounded-[13px] border-[1px] border-expresscash-textos border-solid px-10 placeholder:text-expresscash-textos font-poppins text-expresscash-textos text-[15.36px]"
                type="search"
                placeholder="Buscar usuarios por nombre, email, teléfono o dirección"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoComplete="search"
              />
              <IconMagnifyingGlass className="absolute top-[18px] left-4" />
              <div className="flex w-[120px] h-[54px] ml-4 border-[1px] border-expresscash-textos items-center justify-center gap-2 rounded-[13px]">
                <IconFilter />
                <p className="text-[15.36px] font-poppins text-expresscash-textos">
                  Filtros
                </p>
              </div>
            </div>
            <div className="flex gap-20 items-center">
              <p className="text-expresscash-textos">
                {currentPage} - {totalPages} de {users.length}
              </p>
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
          </div>
          {/* Solicitudes de Préstamos Pendientes */}
          <div>
            <div className="grid grid-cols-[minmax(40px,40px)_minmax(150px,1fr)_minmax(150px,1fr)_minmax(150px,1fr)_minmax(150px,1fr)_minmax(150px,1fr)_minmax(10px,1fr)] gap-10 items-center">
              {/* Encabezados de la tabla */}
              <div className="text-center">
                <input
                  type="checkbox"
                  onChange={e => handleSelectAll(e.target.checked)}
                  checked={isAllChecked}
                  style={{ borderRadius: "5px", color: "#8CC63F" }}
                />
              </div>
              <div className="text-center truncate font-poppins font-bold text-expresscash-textos">
                Nombre
              </div>
              <div className="text-center truncate font-poppins font-bold text-expresscash-textos">
                Score
              </div>
              <div className="font-bold font-poppins text-expresscash-textos text-center truncate">
                Fecha
              </div>
              <div className="font-bold font-poppins text-expresscash-textos text-center truncate">
                Monto
              </div>
              <div className="font-poppins font-bold text-expresscash-textos text-center truncate">
                Contactar
              </div>
              <div className="font-poppins font-bold text-expresscash-textos text-center truncate">
                Acciones
              </div>

              <div className="col-span-7 border-t border-gray-300"></div>

              {filteredLoans.map(user => (
                <React.Fragment key={user.id}>
                  {user.Prestamo.map(
                    (prestamo: Prestamo, prestamoIndex: number) => (
                      <React.Fragment key={prestamo.numero}>
                        {/* Checkbox */}
                        <div className="text-center">
                          <input
                            type="checkbox"
                            onChange={e =>
                              handleCheck(
                                Number(prestamo.numero),
                                e.target.checked
                              )
                            }
                            checked={selectedUsers.includes(
                              Number(prestamo.numero)
                            )}
                            style={{ borderRadius: "5px", color: "#8CC63F" }}
                          />
                        </div>
                        {/* Nombre */}
                        <div className="font-poppins text-center">
                          <div className="font-bold text-expresscash-textos">
                            {prestamo.numero}
                          </div>
                          <div
                            className="text-expresscash-skyBlue font-poppins text-sm cursor-pointer hover:underline mt-1"
                            onClick={() =>
                              handleOpenLoanDetails(user, prestamoIndex)
                            }
                          >
                            {user.first_name} {user.last_name}
                          </div>
                        </div>

                        {/* Score */}
                        <div className="text-left translate-x-[35px] font-poppins font-bold">
                          <span
                            className={`flex items-right gap-2 ${Number(user.score) >= 612 ? "text-green-500" : "text-red-500"}`}
                          >
                            {user.score >= 612 ? <Check /> : <X />}
                            {user.score}
                          </span>
                        </div>

                        {/* Fecha */}
                        <div className="text-center font-poppins">
                          {prestamo.fecha}
                        </div>

                        {/* Monto */}
                        <div className="text-center font-poppins">
                          {prestamo.monto}
                        </div>

                        {/* Contactar */}
                        <div className="text-center flex justify-center gap-4">
                          <a
                            href={`https://wa.me/${user.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-80"
                          >
                            <FaWhatsapp className="w-5 h-5 text-green-500" />
                          </a>

                          <a
                            href={`mailto:${user.email}?subject=Consulta&body=Hola,%20tengo%20una%20pregunta.`}
                            className="hover:opacity-80"
                          >
                            <Mail className="w-5 h-5 text-black-500" />
                          </a>
                        </div>

                        {/* Acciones */}
                        <div className="text-center">
                          <div className="flex justify-center relative">
                            <button
                              className="p-2 rounded-full hover:bg-gray-100"
                              onClick={event =>
                                handleToggleActionsMenu(event, prestamo.numero)
                              }
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>
                            {isActionsMenuOpen[prestamo.numero] &&
                              menuPosition && (
                                <div
                                  ref={actionsMenuRef}
                                  className="absolute z-10 bg-expresscash-white border border-expresscash-gray rounded-lg shadow-lg w-40"
                                  style={{
                                    top: "100%",
                                    right: 0,
                                    marginTop: "0.5rem",
                                  }}
                                >
                                  <div className="py-2">
                                    <button
                                      onClick={e => {
                                        e.stopPropagation();
                                        handleEditLoan(user.Prestamo[0]);
                                      }}
                                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                      Editar
                                    </button>
                                    <button
                                      onClick={e => {
                                        e.stopPropagation();
                                        setSelectedUser(user);
                                        setModalDelete(true);
                                      }}
                                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                                    >
                                      Eliminar
                                    </button>
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="col-span-7 border-t border-gray-300"></div>
                      </React.Fragment>
                    )
                  )}
                </React.Fragment>
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

          {/* Modal de Crear Usuario */}
          <Modal
            isShown={isModalOpen}
            closeModal={closeModal}
            element={
              <CreateLoanRequestModal
                onClose={closeModal}
                onSave={formData => {
                  console.log("Solicitud de préstamo creada:", formData);
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
            client={{
              name: `${selectedUser!.first_name} ${selectedUser!.last_name}`,
              email: selectedUser!.email,
              phone: selectedUser!.phone,
              id: selectedUser!.dni,
              zip_code: selectedUser!.zip_code,
              prestamos: selectedUser!.Prestamo || [],
            }}
          />
        </div>
      )}
    </div>
  );
}

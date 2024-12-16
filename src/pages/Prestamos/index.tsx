/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  MoreVertical,
  Search,
  UserPlus,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import React, { useState, useRef, useEffect } from "react";
import LoanDetails from "./prestamoDetail";
import { User, Prestamo } from "../../store/types/user";

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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [copied, setCopied] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState<{
    [key: number]: boolean;
  }>({});
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
      status: "al_dia",
      Prestamo: [
        {
          numero: "#512",
          fecha: "11/12/2024",
          monto: 12313,
          estado_pago: "",
        },
        {
          numero: "#513",
          fecha: "10/11/2024",
          monto: 4500,
          estado_pago: "",
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

  const handleToggleActionsMenu = (userId: number) => {
    setIsActionsMenuOpen(prevState => ({
      ...prevState,
      [userId]: !prevState[userId],
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

  const handleEditLoan = (user: User) => {
    console.log("Editando préstamo de", user.first_name);
  };

  const handleDeleteLoan = (user: User) => {
    console.log("Eliminando préstamo de", user.first_name);
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
    <div className="flex flex-col pl-18 pt-12 px-10 max-w-[clamp(1000px,67.2vw,1200px)]">
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
              onClick={() => {}}
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
              <div className="flex w-[120px] h-[54px] ml-4 border-[1px] border-expresscash-textos items-center justify-center gap-2 rounded-[13px]">
                <p className="text-[15.36px] font-book text-expresscash-textos">
                  Filtros
                </p>
              </div>
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

          <div className="grid grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)] gap-10 items-center">
            <div className="font-bold text-center truncate">Nombre</div>
            <div className="font-bold text-center truncate">
              Último préstamo
            </div>
            <div className="font-bold text-center truncate">Total Prestado</div>
            <div className="font-bold text-center truncate">Contactar</div>
            <div className="font-bold text-center truncate">
              Estado del Préstamo
            </div>
            <div className="font-bold text-center truncate">Acciones</div>
            <div className="col-span-6 border-t border-gray-300"></div>
            {users
              .filter(
                user =>
                  user.first_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  user.last_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  user.email
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  user.dni.includes(searchQuery)
              )
              .map(user => (
                <React.Fragment key={user.id}>
                  <div className="text-expresscash-skyBlue truncate">
                    <button
                      className="text-expresscash-skyBlue w-full text-center"
                      onClick={() => {
                        if (user.Prestamo && user.Prestamo.length > 0) {
                          handleOpenLoanDetails(user, 0);
                        } else {
                          console.log("No loans available");
                        }
                      }}
                    >
                      {user.first_name} {user.last_name}
                    </button>
                  </div>
                  <div className="text-center truncate">
                    {user.Prestamo && user.Prestamo.length > 0 ? (
                      <div className="flex justify-center items-center">
                        <span className="text-expresscash-skyBlue mr-2">
                          {user.Prestamo[0].numero}
                        </span>
                        <span>{user.Prestamo[0].fecha}</span>
                      </div>
                    ) : (
                      <p className="text-red-500">No tiene préstamos</p>
                    )}
                  </div>

                  <div className="text-center truncate">
                    ${user.totalLoaned.toLocaleString()}
                  </div>

                  <div className="flex justify-center space-x-4 truncate">
                    <button
                      className="p-2 rounded-full hover:bg-gray-100"
                      onClick={() => handleOpenMailModal(user)}
                    >
                      <Mail className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 rounded-full hover:bg-gray-100"
                      onClick={() => handleOpenWhatsappModal(user)}
                    >
                      <FaWhatsapp className="w-5 h-5 text-green-500" />
                    </button>
                  </div>

                  <div className="text-center">
                    {user.Prestamo && user.Prestamo.length > 0 ? (
                      <div className="flex justify-center items-center">
                        <span className="text-expresscash-skyBlue mr-2">
                          {user.status}
                        </span>
                      </div>
                    ) : (
                      "Sin préstamos"
                    )}
                  </div>

                  <div className="flex justify-center relative">
                    <button
                      className="p-2 rounded-full hover:bg-gray-100"
                      onClick={() => handleToggleActionsMenu(user.id)}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {isActionsMenuOpen[user.id] && (
                      <div
                        ref={actionsMenuRef}
                        className="absolute bg-white border border-gray-300 rounded-lg shadow-md mt-2 p-2 w-40"
                      >
                        <button
                          className="w-full text-left p-2 text-expresscash-skyBlue hover:bg-gray-100"
                          onClick={() => handleEditLoan(user)}
                        >
                          Editar
                        </button>
                        <button
                          className="w-full text-left p-2 text-red-500 hover:bg-gray-100"
                          onClick={() => handleDeleteLoan(user)}
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>

                  <hr className="col-span-6 border-t border-gray-300 my-6" />
                </React.Fragment>
              ))}
          </div>

          {selectedUser && (
            <>
              <Modal
                isShown={isModalOpenWhatsapp}
                closeModal={handleCloseWhatsappModal}
                element={
                  <div className="w-[490px] h-[320px] p-10">
                    <button
                      className="absolute top-2 right-2 text-lg font-bold"
                      onClick={handleCloseWhatsappModal}
                    >
                      X
                    </button>
                    <h3 className="text-2xl font-semibold mb-16">
                      Contacto WhatsApp de {selectedUser.first_name}
                    </h3>
                    <div className="flex items-center mb-4">
                      <p className="mr-2 text-lg">
                        Teléfono: {selectedUser.phone}
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedUser.phone);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 6000);
                        }}
                        className="ml-4 text-expresscash-skyBlue flex items-center"
                      >
                        {copied ? (
                          <span className="font-semibold">Copiado!</span>
                        ) : (
                          <span>Copiar</span>
                        )}
                      </button>
                    </div>
                    <a
                      href={`https://wa.me/${selectedUser.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center bg-green-500 text-white rounded-lg p-4 hover:bg-green-600"
                    >
                      <FaWhatsapp className="w-6 h-6 mr-2" />
                      Enviar mensaje
                    </a>
                  </div>
                }
              />

              <Modal
                isShown={isModalOpenEmail}
                closeModal={handleCloseMailModal}
                element={
                  <div className="w-[490px] h-[320px] p-10">
                    <button
                      className="absolute top-2 right-2 text-lg font-bold"
                      onClick={handleCloseMailModal}
                    >
                      X
                    </button>
                    <h3 className="text-2xl font-semibold mb-16">
                      Contacto por Email de {selectedUser.first_name}
                    </h3>
                    <div className="flex items-center mb-20 ml-[50px]">
                      <p className="mr-2 text-lg">{selectedUser.email}</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedUser.email);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 6000);
                        }}
                        className="ml-4 text-expresscash-skyBlue flex items-center"
                      >
                        {copied ? (
                          <span className="font-semibold">Copiado!</span>
                        ) : (
                          <span>Copiar</span>
                        )}
                      </button>
                    </div>
                    <a
                      href={`mailto:${selectedUser.email}`}
                      className="flex items-center justify-center bg-blue-600 text-white rounded-lg p-4 hover:bg-blue-700"
                    >
                      Enviar email
                    </a>
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

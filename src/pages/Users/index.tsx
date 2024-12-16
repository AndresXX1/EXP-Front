/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  IconEdit,
  IconFilter,
  IconMagnifyingGlass,
  IconProhibited,
  IconX,
} from "@utils/svg";
import { Mail, MailIcon, MoreVertical, UserIcon } from "lucide-react";
import Modal from "@components/Modal";
import React from "react";
import { EditUserModal, UserFormData } from "./editUserModal"; // Asegúrate de importar esto correctamente
import UserDetailsModal from "./userDetailModal";
import CreateUserModal from "./createUserForm";
import { FaWhatsapp, FaCopy } from "react-icons/fa";
import { User, Prestamo, Address } from "../../store/types/user";

const Users = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      first_name: "Andres",
      last_name: "Vera",
      phone: "3511425568",
      address: [],
      dni: "39690691",
      email: "andres@hotmail.com",
      Prestamo: [
        {
          numero: "#512",
          fecha: "11/12/2024",
          monto: 12313,
          estado_pago: "en mora",
        },
        {
          numero: "#513",
          fecha: "10/11/2024",
          monto: 4500,
          estado_pago: "pagado",
        },
      ],
      birthday: "",
      points: 0,
      cuponizate: false,
      avatar: "",
      gender: "",
      cuil: "",
      bank: "",
      paymentDate: "",
      last_login: "",
      create: "",
      image: "",
      status: "",
      totalLoaned: 0,
      subscription_status: "",
      prestamo: [],
    },
    {
      id: 1,
      first_name: "Andressss",
      last_name: "Veraaaa",
      phone: "3511425568",
      address: [],
      dni: "39690691",
      email: "andres@hotmail.com",
      Prestamo: [],
      birthday: "",
      points: 0,
      cuponizate: false,
      avatar: "",
      gender: "",
      cuil: "",
      bank: "",
      paymentDate: "",
      last_login: "",
      create: "",
      image: "",
      status: "",
      totalLoaned: 0,
      subscription_status: "",
      prestamo: [],
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [modalEdit, setModalEdit] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<UserFormData | null>(null);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
  const [isModalOpenWhatsapp, setIsModalOpenWhatsapp] = useState(false); // Modal de WhatsApp
  const [isModalOpenEmail, setIsModalOpenEmail] = useState(false);
  const [contactUser, setContactUser] = useState<User | null>(null);
  const [copied, setCopied] = useState(false);
  const [, setShowDetailsModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setVisibleIndex(null); // Cierra el menú si se hace clic fuera
      }
    };

    // Escucha los clics fuera del menú
    document.addEventListener("mousedown", handleClickOutside);

    // Limpieza del efecto cuando el componente se desmonte
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Filtrar los usuarios según el searchQuery
    const filtered = users.filter(user => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      const email = user.email.toLowerCase();
      const phone = user.phone.toLowerCase();
      const address = user.address
        .map(addr => addr?.street || "")
        .join(" ")
        .toLowerCase();

      return (
        fullName.includes(searchQuery.toLowerCase()) ||
        email.includes(searchQuery.toLowerCase()) ||
        phone.includes(searchQuery.toLowerCase()) ||
        address.includes(searchQuery.toLowerCase())
      );
    });
    setFilteredUsers(filtered); // Actualizar los usuarios filtrados
  }, [searchQuery, users]); // Se ejecuta cuando cambia el searchQuery

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenModal = (type: "whatsapp" | "email", user: User) => {
    setContactUser(user); // Establecer el usuario en el estado de contacto
    setShowDetailsModal(false); // Asegurarse de que el modal de detalles no se muestre

    if (type === "whatsapp") {
      setIsModalOpenWhatsapp(true); // Abrir modal de WhatsApp
    } else if (type === "email") {
      setIsModalOpenEmail(true); // Abrir modal de Email
    }
  };

  const handleOpenDetailsModal = (user?: User) => {
    // Solo cambia selectedUser si no hay modal de contacto abierto
    if (!isModalOpenWhatsapp && !isModalOpenEmail) {
      setSelectedUser(user ?? null); // Si no hay usuario proporcionado, resetea a null
    }
  };

  // Mantén los modales de contacto separados del modal de detalles del usuario
  const handleCloseModal = () => {
    setIsModalOpenWhatsapp(false); // Cerrar modal de WhatsApp
    setIsModalOpenEmail(false); // Cerrar modal de Email
    // Aquí no se limpia `selectedUser`, porque no queremos que cambie al cerrar el modal
  };

  const toggleMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();

    const isMenuOverflowingRight = buttonRect.left + 158 > window.innerWidth;
    const isMenuOverflowingBottom =
      buttonRect.top + buttonRect.height + 90 > window.innerHeight;

    const menuPosition = {
      top: isMenuOverflowingBottom
        ? buttonRect.top + window.scrollY - 90
        : buttonRect.top + window.scrollY + buttonRect.height + 10,
      left: isMenuOverflowingRight
        ? buttonRect.left + window.scrollX - 158
        : buttonRect.left + window.scrollX - 40,
    };

    setVisibleIndex(visibleIndex === index ? null : index);
    setMenuPosition(menuPosition);
  };

  const handleEditUser = (user: User) => {
    // Convertir User a UserFormData
    interface UserFormData {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
      avatar: string;
      id: number;
      cuil: string;
      gender: string;
      birthday: string;
      points: number;
      address: Address[];
      bank: string;
      paymentDate: string;
      lastLogin: string;
      createdAt: string;
      image: string;
      status: string;
      totalLoaned: number;
      Prestamo: Prestamo[];
      subscriptionStatus: string;
      dni: string;
      subscription_status: string; // Asegúrate de que esta línea esté presente
    }

    setModalEdit(true);
  };

  const handleSaveUser = async (updatedUser: UserFormData) => {
    const updatedUsers = users.map(user =>
      user.id === updatedUser.id
        ? {
            ...user,
            first_name: updatedUser.firstName,
            last_name: updatedUser.lastName,
            phone: updatedUser.phone,
          }
        : user
    );

    setUsers(updatedUsers);
    setModalEdit(false);
  };

  const handleConfirmDelete = async (id: number) => {
    setUsers(
      users.map(user => (user.id === id ? { ...user, blocked: true } : user))
    );
    setModalDelete(false);
  };

  function handleEdit(user: User) {
    setUserToEdit({
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      email: user.email,
      avatar: user.avatar || "",
      id: user.id,
      cuil: user.cuil || "",
      gender: user.gender || "",
      birthday: user.birthday || "",
      points: user.points || 0,
      address: user.address || [{ street: "", city: "" }],
      bank: user.bank || "",
      paymentDate: user.paymentDate || "",
      lastLogin: user.last_login || "",
      createdAt: user.create || "",
      image: user.image || "",
      status: user.status || "",
      totalLoaned: user.totalLoaned || 0,
      Prestamo: user.Prestamo || [],
      subscriptionStatus: user.subscriptionStatus || "", // Cambiada de subscription_status a subscriptionStatus
      dni: user.dni || "",
    });
    setModalEdit(true);
  }

  function handleDelete(_user: User): void {
    throw new Error("Function not implemented.");
  }

  // Función para abrir el modal
  const openModal = () => setIsModalOpen(true);

  // Función para cerrar el modal
  const closeModal = () => setIsModalOpen(false);

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  function setSelectedLoan(firstLoan: Prestamo | null) {
    if (firstLoan) {
      // Si hay un préstamo, haz algo con él (por ejemplo, mostrar detalles del préstamo).
      console.log("Préstamo seleccionado:", firstLoan);
    } else {
      console.log("No hay préstamos para este usuario.");
    }
  }

  return (
    <>
      {/* Si no hay un usuario seleccionado, se muestra la lista de usuarios */}
      {!selectedUser ? (
        <div className="flex flex-col pl-18 pt-12 px-10 max-w-[clamp(1000px,67.2vw,1200px)]">
          <div className="flex gap-2 mb-2">
            <p className="text-[3rem] text-expresscash-textos font-bold">
              Clientes
            </p>
            <p className="text-[40px] text-expresscash-textos font-book mt-[6px]">
              ({users.length})
            </p>
          </div>

          <div className="flex flex-col pl-[780px] translate-y-[-70px] text-expresscash-white translate-x-[125px]">
            <button
              className="border border-expresscash-skyBlue border-solid border-1 rounded-lg bg-expresscash-skyBlue h-[40px] w-[240px] flex items-center justify-center gap-2"
              onClick={openModal} // Abrir modal al hacer clic
            >
              <UserIcon className="w-8 h-5" />
              <span>Agregar nuevo cliente</span>
            </button>
          </div>

          <div className="flex justify-between mb-8">
            <div className="relative flex">
              <input
                className="w-[457px] h-[54px] rounded-[13px] border-[1px] border-argenpesos-textos border-solid px-10 placeholder:text-argenpesos-textos font-book text-argenpesos-textos text-[15.36px]"
                type="search"
                placeholder="Buscar usuarios por nombre, email, teléfono o dirección"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)} // Actualiza el estado con el valor del input
                autoComplete="search"
              />
              <IconMagnifyingGlass className="absolute top-[18px] left-4" />
              <div className="flex w-[120px] h-[54px] ml-4 border-[1px] border-expresscash-textos items-center justify-center gap-2 rounded-[13px]">
                <IconFilter />
                <p className="text-[15.36px] font-book text-expresscash-textos">
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

          {/* Mostrar listado de usuarios */}
          <div className="grid grid-cols-[minmax(220px,1fr)_minmax(220px,1fr)_minmax(220px,1fr)_minmax(220px,1fr)_minmax(120px,1fr)] gap-10 items-center">
            {/* Encabezados */}
            <div className="font-bold text-center truncate">Nombre</div>
            <div className="font-bold text-center truncate">
              Último préstamo
            </div>
            <div className="font-bold text-center truncate">Total Prestado</div>
            <div className="font-bold text-center truncate">Contactar</div>
            <div className="font-bold text-center truncate">Acciones</div>

            {/* Separador */}
            <div className="col-span-5 border-t border-gray-300"></div>

            {/* Información de los usuarios */}
            {currentUsers.map((user, index) => (
              <React.Fragment key={user.id}>
                <div className="text-expresscash-skyBlue truncate">
                  <button
                    className="text-expresscash-skyBlue w-full text-center"
                    onClick={() => {
                      // Verificar si el usuario tiene préstamos y seleccionar el primero
                      const firstLoan =
                        user.Prestamo && user.Prestamo.length > 0
                          ? user.Prestamo[0]
                          : null;
                      setSelectedLoan(firstLoan);
                    }}
                  >
                    {user.first_name} {user.last_name}
                  </button>
                </div>

                {/* Último préstamo */}
                <div className="text-center truncate">
                  {user.Prestamo.length > 0 ? (
                    <div className="flex justify-center items-center">
                      <span className="text-expresscash-skyBlue truncate mr-2">
                        {user.Prestamo[0].numero}
                      </span>
                      <span className="truncate">{user.Prestamo[0].fecha}</span>
                    </div>
                  ) : (
                    "Sin préstamos"
                  )}
                </div>

                {/* Total prestado */}
                <div className="text-center truncate">
                  $
                  {user.Prestamo.reduce(
                    (
                      total: number,
                      prestamo: { monto: { toString: () => string } }
                    ) => total + parseInt(prestamo.monto.toString(), 10),
                    0
                  )}
                </div>

                {/* Contactar */}
                <div className="flex justify-center space-x-4 truncate">
                  <button
                    className="p-2 rounded-full hover:bg-gray-100"
                    onClick={() => handleOpenModal("email", user)}
                  >
                    <Mail className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-gray-100"
                    onClick={() => handleOpenModal("whatsapp", user)}
                  >
                    <FaWhatsapp className="w-5 h-5 text-green-500" />
                  </button>
                </div>

                {/* Acciones */}
                <div className="flex justify-center">
                  <button
                    className="p-2 rounded-full hover:bg-gray-100"
                    onClick={event => toggleMenu(event, index)}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {visibleIndex === index && menuPosition && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 transition-all duration-200 ease-in-out opacity-100 max-h-[90px] bg-expresscash-white border-[1px] border-solid border-expresscash-gray rounded-[7px] w-[158px]"
                      style={{
                        top: `${menuPosition.top - 73}px`,
                        left: `${menuPosition.left - 0}px`,
                      }}
                    >
                      <div className="flex flex-col w-full gap-3 items-center justify-center h-full">
                        <p
                          onClick={e => {
                            e.stopPropagation();
                            handleEditUser(user);
                          }}
                          className="flex items-center mr-7 cursor-pointer hover:bg-gray-200 p-2 rounded-lg"
                        >
                          <IconEdit color="#575757" />
                          Editar
                        </p>
                        <div
                          onClick={e => {
                            e.stopPropagation();
                            setModalDelete(true);
                          }}
                          className="flex items-center mr-2 cursor-pointer translate-y-[-10px] hover:bg-gray-200 p-2 rounded-lg"
                        >
                          <IconProhibited />
                          Bloquear
                        </div>
                        <div className="flex justify-center"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal de Bloqueo */}
                {modalDelete && user?.id === user.id && (
                  <Modal
                    isShown={modalDelete}
                    element={
                      <div className="px-6 py-6 flex flex-col justify-center w-[481px] h-[192px]">
                        <div className="flex justify-between items-start">
                          <p className="text-[1rem] text-expresscash-textos font-bold">
                            ¿Está seguro que desea bloquear este usuario?
                          </p>
                          <p
                            className="cursor-pointer mt-[6px]"
                            onClick={() => setModalDelete(false)}
                          >
                            <IconX />
                          </p>
                        </div>
                        <p className="text-[14px] font-book text-expresscash-gray w-[380px] mb-10 mt-1">
                          Si lo bloquea podrá volver a desbloquearlo luego.
                        </p>
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleConfirmDelete(user.id)}
                            className="bg-expresscash-red w-[109px] h-[38px] rounded-[5px] text-expresscash-white text-[1rem] font-book"
                          >
                            Bloquear
                          </button>
                          <button
                            onClick={() => setModalDelete(false)}
                            className="border-[1px] border-solid border-expresscash-gray w-[109px] h-[38px] rounded-[5px] text-expresscash-gray text-[1rem] font-book"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    }
                  />
                )}
                <div className="col-span-5 border-t border-gray-300"></div>
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : (
        // Si hay un usuario seleccionado, muestra los detalles de ese usuario
        <UserDetailsModal
          user={selectedUser}
          onClose={() => handleOpenDetailsModal()}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onEditPrestamo={function (_prestamo: Prestamo, _index: number): void {
            throw new Error("Function not implemented.");
          }}
          onDeletePrestamo={function (_index: number): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}
      <Modal
        isShown={isModalOpen}
        closeModal={closeModal}
        element={
          <CreateUserModal
            onClose={closeModal}
            onSave={function (_formData: any): void {
              throw new Error("Function not implemented.");
            }}
          />
        } // Pasamos el modal de creación de usuario
      />
      {/* Modal de edición de usuario */}
      {modalEdit && userToEdit && (
        <Modal
          isShown={modalEdit}
          closeModal={() => setModalEdit(false)}
          element={
            <EditUserModal
              user={userToEdit}
              onClose={() => setModalEdit(false)}
              onSave={handleSaveUser}
              getUsersList={() => Promise.resolve()}
              setModalEdit={setModalEdit}
              onAddressChange={() => {}}
            />
          }
        />
      )}
      {/* Modal de WhatsApp */}
      <Modal
        isShown={isModalOpenWhatsapp}
        closeModal={handleCloseModal}
        element={
          <div className="w-[490px] h-[320px] p-10">
            <button
              className="absolute top-2 right-2 text-lg font-bold"
              onClick={handleCloseModal}
            >
              X
            </button>

            {contactUser && (
              <>
                {/* Título con separación */}
                <h3 className="text-2xl font-semibold mb-16">
                  Contacto WhatsApp de {contactUser.first_name}
                </h3>

                {/* Teléfono con icono de copiar */}
                <div className="flex items-center mb-[70px] ml-5">
                  <p className="mr-2 text-lg">Teléfono: {contactUser.phone}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(contactUser.email); // Copiar correo al portapapeles
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
                  href={`https://wa.me/${contactUser.phone}`}
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
        closeModal={handleCloseModal}
        element={
          <div className="w-[490px] h-[320px] p-10">
            {/* Cerrar modal */}
            <button
              className="absolute top-2 right-2 text-lg font-bold"
              onClick={handleCloseModal}
            >
              X
            </button>

            {contactUser && (
              <>
                {/* Título y dirección de correo */}
                <h3 className="text-2xl font-semibold mb-16">
                  Contacto por Email de {contactUser.first_name}
                </h3>

                <div className="flex items-center mb-20 ml-[50px]">
                  <p className="mr-2 text-lg"> {contactUser.email}</p>

                  {/* Botón para copiar el correo */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(contactUser.email); // Copiar correo al portapapeles
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
                  href={`mailto:${contactUser.email}?subject=Consulta&body=Hola,%20tengo%20una%20pregunta.`}
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
  );
};

export default Users;

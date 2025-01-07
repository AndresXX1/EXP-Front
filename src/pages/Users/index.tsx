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
import { Mail, MoreVertical, UserIcon } from "lucide-react";
import Modal from "@components/Modal";
import React from "react";
import { EditUserModal, UserFormData } from "./editUserModal";
import UserDetailsModal from "./userDetailModal";
import CreateUserModal from "./createUserForm";
import { FaWhatsapp } from "react-icons/fa";
import { User, Prestamo } from "../../store/types/user";

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
      score: 612,
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
      score: 612,
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
  const [isModalOpenWhatsapp] = useState(false);
  const [isModalOpenEmail] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
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
        setVisibleIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
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
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenDetailsModal = (user?: User) => {
    if (!isModalOpenWhatsapp && !isModalOpenEmail) {
      setSelectedUser(user ?? null);
    }
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

  const handleEditUser = (_user: User) => {
    setUserToEdit({
      firstName: _user.first_name,
      lastName: _user.last_name,
      phone: _user.phone,
      email: _user.email,
      avatar: _user.avatar || "",
      id: _user.id,
      cuil: _user.cuil || "",
      gender: _user.gender || "",
      birthday: _user.birthday || "",
      points: _user.points || 0,
      address: _user.address || [{ street: "", city: "" }],
      bank: _user.bank || "",
      paymentDate: _user.paymentDate || "",
      lastLogin: _user.last_login || "",
      createdAt: _user.create || "",
      image: _user.image || "",
      status: _user.status || "",
      totalLoaned: _user.totalLoaned || 0,
      Prestamo: _user.Prestamo || [],
      subscriptionStatus: _user.subscriptionStatus || "",
      dni: _user.dni || "",
      score: _user.score || 0, // Add this line
    });
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
      subscriptionStatus: user.subscriptionStatus || "",
      dni: user.dni || "",
      score: user.score || 0, // Add this line
    });
    setModalEdit(true);
  }

  function handleDelete(_user: User): void {
    throw new Error("Function not implemented.");
  }

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  const handleSelectAll = (checked: boolean) => {
    setIsAllChecked(checked);
    setSelectedUsers(checked ? users.map(user => user.id) : []);
  };

  const handleCheck = (userId: number, checked: boolean) => {
    setSelectedUsers(prevSelected => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter(id => id !== userId);
      }
      return [userId];
    });
    setIsAllChecked(false);
  };

  return (
    <>
      {!selectedUser ? (
        <div className="flex flex-col  pl-18 pt-12 px-[40px] max-w-[clamp(1600px,67.2vw,1600px)] bg-[white]">
          <div className="flex gap-2 mb-2">
            <p className="text-[3rem] text-expresscash-textos font-poppins">
              Clientes
            </p>
            <p className="text-[40px] text-expresscash-textos font-poppins mt-[6px]">
              ({users.length})
            </p>
          </div>

          <div className="flex flex-col pl-[780px] translate-y-[-70px] text-expresscash-white translate-x-[125px]">
            <button
              className="border font-poppins border-expresscash-skyBlue border-solid border-1 rounded-lg bg-expresscash-skyBlue h-[40px] w-[240px] flex items-center justify-center gap-2"
              onClick={openModal}
            >
              <UserIcon className="w-8 h-5 " />
              <span>Agregar nuevo cliente</span>
            </button>
          </div>

          <div className="flex justify-between mb-7">
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

          {/* Mostrar listado de usuarios */}
          <div className="grid grid-cols-[minmax(40px,40px)_minmax(130px,1fr)_minmax(130px,1fr)_minmax(130px,1fr)_minmax(130px,1fr)_minmax(130px,1fr)_minmax(10px,1fr)] gap-10 items-center">
            {/* Encabezados */}
            <div className="text-center">
              <input
                type="checkbox"
                onChange={e => handleSelectAll(e.target.checked)}
                checked={isAllChecked}
                style={{ borderRadius: "5px", color: "#8CC63F" }}
              />
            </div>
            <div className="font-poppins text-center truncate font-bold text-expresscash-textos">
              Nombre
            </div>
            <div className="font-poppins text-center truncate font-bold text-expresscash-textos">
              Último préstamo
            </div>
            <div className="font-poppins text-center truncate font-bold text-expresscash-textos">
              Total Prestado
            </div>
            <div className="font-poppins text-center truncate font-bold text-expresscash-textos">
              Total Impago
            </div>
            <div className="font-poppins text-center truncate font-bold text-expresscash-textos">
              Contactar
            </div>
            <div className="font-poppins text-center truncate font-bold text-expresscash-textos">
              Acciones
            </div>

            {/* Separador */}
            <div className="col-span-7 border-t border-gray-300"></div>

            {/* Información de los usuarios */}
            {currentUsers.map((user, index) => (
              <React.Fragment key={user.id}>
                {/* Checkbox */}
                <div className="text-center">
                  <input
                    type="checkbox"
                    onChange={e => handleCheck(user.id, e.target.checked)}
                    checked={selectedUsers.includes(user.id)}
                    style={{ borderRadius: "5px", color: "#8CC63F" }}
                  />
                </div>
                {/* nombre */}
                <div className=" text-expresscash-skyBlue truncate font-poppins text-center ">
                  <button
                    className="text-expresscash-skyBlue text-center font-poppins hover:underline mt-1"
                    onClick={() => handleOpenDetailsModal(user)}
                  >
                    {user.first_name} {user.last_name}
                  </button>
                </div>

                {/* Último préstamo */}
                <div className="text-center truncate font-poppins">
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
                <div className="text-center truncate font-poppins">
                  $
                  {user.Prestamo.reduce(
                    (
                      total: number,
                      prestamo: { monto: { toString: () => string } }
                    ) => total + parseInt(prestamo.monto.toString(), 10),
                    0
                  )}
                </div>

                {/* Total Impago */}
                <div className="text-center truncate font-poppins">
                  $
                  {user.Prestamo.reduce(
                    (total: number, prestamo: { total_Impago: string }) => {
                      const impago = prestamo.total_Impago
                        ? parseInt(prestamo.total_Impago, 10)
                        : 0;
                      return total + impago;
                    },
                    0
                  )}
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
                          <p className="text-[1rem] text-expresscash-textos font-poppins">
                            ¿Está seguro que desea bloquear este usuario?
                          </p>
                          <p
                            className="cursor-pointer mt-[6px]"
                            onClick={() => setModalDelete(false)}
                          >
                            <IconX />
                          </p>
                        </div>
                        <p className="text-[14px] font-poppins text-expresscash-gray w-[380px] mb-10 mt-1">
                          Si lo bloquea podrá volver a desbloquearlo luego.
                        </p>
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleConfirmDelete(user.id)}
                            className="bg-expresscash-red w-[109px] h-[38px] rounded-[5px] text-expresscash-white text-[1rem] font-poppins"
                          >
                            Bloquear
                          </button>
                          <button
                            onClick={() => setModalDelete(false)}
                            className="border-[1px] border-solid border-expresscash-gray w-[109px] h-[38px] rounded-[5px] text-expresscash-gray text-[1rem] font-poppins"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    }
                  />
                )}
                <div className="col-span-7 border-t border-gray-300"></div>
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
        }
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
    </>
  );
};

export default Users;

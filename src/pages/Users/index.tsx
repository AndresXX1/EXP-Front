// src/pages/Users/Users.tsx
import { useState, useEffect } from "react";
import {
  ArrowBlue,
  ArrowLeft,
  ArrowRight,
  IconFilter,
  IconMagnifyingGlass,
} from "@utils/svg";
import { getusers } from "../../store/services/users";
import { UserFormData } from "./editUserModal";
import UserRow from "./UserRow"; // Importamos el componente UserRow
import { blockUserAsync } from "@store/actions/user";
import { User } from "@store/types/user";

// Componente principal para la lista de usuarios
const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [, setUserToEdit] = useState<UserFormData | null>(null);
  const [, setModalEdit] = useState(false);

  const itemsPerPage = 6;

  // Función para obtener la lista de usuarios
  const getUsersList = async () => {
    const users = await getusers();
    setUsers(users);
  };

  useEffect(() => {
    getUsersList();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      const sortedAndFilteredUsers = users
        .filter(user =>
          `${user.first_name} ${user.last_name} ${user.email} ${user.phone} ${user.address[0]?.street}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
          const dateA = new Date(a.create);
          const dateB = new Date(b.create);
          return sortOrder === "asc"
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        });

      setFilteredUsers(sortedAndFilteredUsers);
    }
  }, [searchQuery, users, sortOrder]);

  const toggleSortOrder = () =>
    setSortOrder(prevOrder => (prevOrder === "asc" ? "desc" : "asc"));
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrevPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleBlockUser = async (userId: string) => {
    try {
      const result = await blockUserAsync(Number(userId));
      if (result !== undefined) {
        getUsersList();
      }
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const handleEditUser = (user: User) => {
    const userFormData: UserFormData = {
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      birthday: user.birthday,
      points: user.points,
      image: user.avatar,
      address: user.address,
      cuil: user.cuil,
      gender: user.gender,
      subscriptionStatus: undefined,
      id: Number(user.id),
      avatar: "",
    };
    setUserToEdit(userFormData);
    setModalEdit(true);
  };

  return (
    <div className="flex flex-col pl-16 pt-12 px-10 max-w-[clamp(1000px,77.2vw,1200px)]">
      <div className="flex gap-2 mb-2">
        <p className="text-[3rem] text-expresscash-textos font-bold">
          Usuarios
        </p>
        <p className="text-[40px] text-expresscash-textos font-book mt-[6px]">
          {`(${filteredUsers.length})`}
        </p>
      </div>

      <div className="flex justify-between mb-8">
        <div className="relative flex">
          <input
            className="w-[457px] h-[54px] rounded-[13px] border-[1px] border-expresscash-textos border-solid px-10 placeholder:text-expresscash-textos font-book text-expresscash-textos text-[15.36px]"
            type="search"
            placeholder="Buscar usuarios por nombre, email, teléfono o dirección"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            autoComplete="search"
            onFocus={e => {
              e.target.setAttribute("autocomplete", "off");
              e.target.removeAttribute("autocomplete");
            }}
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
            {currentPage} - {totalPages} de {filteredUsers.length}
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

      <div className="grid grid-cols-6 gap-8 mb-10 bg-gray-100 p-16 rounded-t-lg items-center w-[1240px] translate-x-[-40px]">
        <div className="font-bold text-expresscash-textos text-center ">
          Usuarios
        </div>
        <div className="font-bold text-expresscash-textos text-center translate-x-14">
          Cuponizate
        </div>
        <div className="font-bold text-expresscash-textos text-center translate-x-9">
          Edad
        </div>
        <div className="font-bold text-expresscash-textos text-center ">
          Puntos
        </div>
        <div className="font-bold text-expresscash-textos text-left translate-x-1 ">
          Registrado
        </div>
        <div
          className="cursor-pointer flex items-center justify-left"
          onClick={toggleSortOrder}
        >
          <div className="font-bold text-expresscash-textos text-center translate-x-5">
            Estado
          </div>
          <div className="absolute right-0 top-[50%] transform translate-x-[-55px]">
            <ArrowBlue />
          </div>
        </div>
      </div>

      <div>
        {currentUsers.map(user => (
          <UserRow
            key={user.id}
            avatar={user.avatar}
            user={user}
            getUsersList={getUsersList}
            handleBlockUser={handleBlockUser}
            handleEditUser={handleEditUser}
          />
        ))}
      </div>
    </div>
  );
};

export default Users;

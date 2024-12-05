import { useState, useRef, useEffect } from "react";
import { BlockedIcon, IconEdit, ThreePoints } from "@utils/svg";
import { User } from "@store/types/user";
import { apiUrls } from "@config/config";
import { calculateAge, formatDateString } from "@utils/format";
import Modal from "@components/Modal";
import ModalAction from "@components/ModalAction";
import { putUserCuponizateById } from "@store/services/users";
import { EditUserModal, UserFormData } from "./editUserModal";
import { blockUserAsync, unblockUserAsync } from "@store/actions/user"; 
import { useDispatch } from "react-redux";
import { AppDispatch } from "@store";
import { Address as AddressType } from '../../store/types/user';

interface UserRowProps {
  user: User;
  getUsersList: () => Promise<void>;
  handleEditUser: (user: User) => void;
  handleBlockUser?: (userId: string) => Promise<void>;
  avatar?: string
}

const UserRow = ({ user, getUsersList }: UserRowProps) => {
  const [menuVisibility, setMenuVisibility] = useState(false);
  const [modalActiveCuponizate, setModalActiveCuponizate] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserFormData | null>(null);
  const [, setNewAddress] = useState<AddressType>({
    street: '',
    number: 0,
    zipCode: '',
    city: '',
    province: ''
  });
  const dispatch = useDispatch<AppDispatch>();
  
  // Ref para el menú
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleVisibility = () => {
    setMenuVisibility(!menuVisibility);
  };

  const handleNewAddressChange = (field: keyof AddressType, value: string | number) => {
    setNewAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleAction = async () => {
    const response = await putUserCuponizateById(Number(user.id));
    if (response) {
      getUsersList();
      setModalActiveCuponizate(false);
    }
  };

  const handleBlockUser = async () => {
    const response = await dispatch(blockUserAsync(Number(user.id)));
    if (response.payload) {
      getUsersList();  
    }
  };

  const handleUnblockUser = async () => {
    const response = await dispatch(unblockUserAsync(Number(user.id))); 
    if (response.payload) {
      getUsersList();
    }
  };

  const openEditModal = (user: User) => {
    const userFormData: UserFormData = {
      firstName: user.first_name || "-",
      lastName: user.last_name || "-",
      phone: user.phone || "-",
      birthday: user.birthday || "-",
      points: user.points || 0,
      image: user.avatar,
      address: user.address || [{ street: "-", city: "-" }],
      cuil: user.cuil || "-",
      gender: user.gender || "-",
      subscriptionStatus: undefined,
      id: Number(user.id),
      avatar: "",
    };
    setUserToEdit(userFormData);
    setModalEdit(true);
  };

  const truncateName = (name: string) =>
    name.length > 25 ? `${name.slice(0, 22)}...` : name;

  const handleSave = async (user: UserFormData): Promise<void> => {
    try {
      await getUsersList();
      console.log(user)
      setModalEdit(false);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // Cerrar el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuVisibility(false); // Cierra el menú si el clic está fuera de él
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Modal
        closeModal={setModalActiveCuponizate}
        isShown={modalActiveCuponizate}
        element={
          <ModalAction
            close={() => setModalActiveCuponizate(false)}
            handleAction={handleAction}
            title={`¿Está seguro que desea ${user.cuponizate ? "desactivar" : "activar"} este usuario?`}
            description={`En caso de que quiera ${user.cuponizate ? "activarlo" : "desactivarlo"} más adelante podrá hacerlo desde este menú. Email de usuario: ${user.email}`}
            textCancel="Cancelar"
            textOk={user.cuponizate ? "Desactivar" : "Activar"}
          />
        }
      />
      
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-6 relative items-center justify-start">
        <div className="flex items-center gap-1 self-center">
          <img className="w-[40px] h-[40px] rounded-full mr-2" src={apiUrls.avatarUser(user.avatar)} alt={user.first_name} />
          <p className="text-[1rem] text-Express-Cash-textos font-book text-left self-center">
            {truncateName(`${user.first_name || "-"} ${user.last_name || "-"}`)}
          </p>
        </div>
      
        <button
          type="button"
          title={user.cuponizate ? "Desactivar" : "Activar"}
          onClick={() => setModalActiveCuponizate(true)}
          className={`text-[0.9rem] font-book border-[2px] rounded-full py-[4px] w-[80%] ${user.cuponizate ? "text-Express-Cash-skyBlue" : "text-Express-Cash-textos"}`}
        >
          {user.cuponizate ? "Activo" : "Inactivo"}
        </button>

        <p className="text-[1rem] text-Express-Cash-textos font-book text-center">{calculateAge(user.birthday) || "-"}</p>
        <p className="text-[1rem] text-Express-Cash-textos font-book text-center">{user.points || "-"}</p>
        <p className="text-[0.9rem] text-Express-Cash-textos font-book text-center">{formatDateString(user.create).slice(0, 13) || "-"}</p>
        <p className="text-[1rem] text-Express-Cash-textos font-book text-center translate-x-5">
          {user.isBlocked ? "Bloqueado" : "Activo"}
        </p>

        <div
          onClick={() => toggleVisibility()}
          className="absolute right-0 top-[5%] w-[30px] h-[30px] p-2 cursor-pointer z-[1] translate-x-[65px] translate-y-[0px]"
        >
          <button className="w-full h-full">
            <ThreePoints />
          </button>

          <div
            ref={menuRef} 
            className={`transition-all duration-200 ease-in-out ${menuVisibility ? "opacity-100 h-[100px]" : "opacity-0 max-h-0"} bg-white border-[1px] border-solid border-gray-300 rounded-[7px] w-[130px] absolute right-0 z-[10]`}
          >
            <div className="flex flex-col w-full gap-2 items-start justify-center h-full py-2 px-3">
              <p onClick={() => openEditModal(user)} className="flex items-center cursor-pointer text-gray-700">
                <IconEdit color="#575757" />
                Editar
              </p>
              <p
                onClick={user.isBlocked ? handleUnblockUser : handleBlockUser}
                className="flex items-center gap-1 cursor-pointer text-gray-700"
              >
                <BlockedIcon />
                {user.isBlocked ? "Desbloquear" : "Bloquear"}
              </p>
            </div>
          </div>
        </div>

        <div className="w-[114%] h-[1px] bg-Express-Cash-gray mt-5 col-span-6 mb-10 -ml-[5%]"></div>
      </div>

      {modalEdit && userToEdit && (
        <Modal
          isShown={modalEdit}
          closeModal={() => setModalEdit(false)}
          element={
            <EditUserModal
              user={userToEdit}
              onClose={() => setModalEdit(false)}
              onSave={handleSave}
              getUsersList={getUsersList} 
              setModalEdit={setModalEdit} 
              onAddressChange={handleNewAddressChange}
            />
          }
        />
      )}
    </>
  );
};

export default UserRow;

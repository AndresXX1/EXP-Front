import { apiUrls } from "@config/config";
import { IAdmin } from ".";
import { IconDelete } from "@utils/svg";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { alertError } from "@utils/alerts";
import { deleteAdminById } from "@store/services/admin";

interface AdminCardProps {
  admin: IAdmin;
  fetchAdmins: () => void;
}

const AdminCard = ({ admin, fetchAdmins }: AdminCardProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const handleDeleteAdmin = async () => {
    if (user?.role === "super_admin") {
      if (admin.role === "super_admin") {
        alertError("No puedes eliminar a un super administrador");
      } else {
        const confirmDelete = await deleteAdminById(admin.id);
        if (confirmDelete) {
          fetchAdmins();
        }
      }
    } else {
      alertError("No tienes permisos para realizar esta acción");
    }
  };
  return (
    <div>
      <div className="flex justify-between pr-20 items-center">
        <div className="flex items-center gap-1">
          <img
            className="w-[50px] h-[50px]"
            src={apiUrls.avatarUser(admin.avatar)}
            alt={admin.full_name}
          />
          <p className="text-[1rem] text-expresscash-textos font-book">
            {admin.full_name || "Nombre sin asignar"}
          </p>
        </div>
        <p className="text-[1rem] text-expresscash-textos font-book">
          {admin.email}
        </p>
        <div
          className="flex justify-center items-center gap-1 cursor-pointer"
          onClick={handleDeleteAdmin}
        >
          <IconDelete />
          <p className="text-[1rem] font-book text-expresscash-red">Eliminar</p>
        </div>
      </div>
      <div className="w-[100%] h-[1px] bg-expresscash-gray2 mt-7 col-span-6 mb-7"></div>
    </div>
  );
};

export default AdminCard;

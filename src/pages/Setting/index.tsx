import { useState, useEffect } from "react";
import AdminCard from "./AdminCard";
import { getAllAdmins } from "@store/services/admin";
import DataAdmin from "./DataAdmin";
import CreateAdmin from "./CreateAdmin";

export interface IAdmin {
  id: string;
  avatar: string;
  full_name: string;
  email: string;
  role: string;
}

const Setting = () => {
  const [admins, setAdmins] = useState<IAdmin[]>([]);

  const fetchAdmins = async () => {
    const response = await getAllAdmins();
    setAdmins(response);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <>
      <div className="flex flex-col pl-16 pt-12 px-10 h-[250%] w-[1300px] bg-[white]">
        <p className="text-[3rem] text-expresscash-textos font-poppins pb-14">
          Configuración
        </p>
        <CreateAdmin fetchAdmins={fetchAdmins} />

        {admins.length !== 0 && (
          <div className="flex justify-between gap-5 my-8 max-w-[950px]">
            <p className="text-[1rem] text-expresscash-textos font-poppins">
              Nombre
            </p>

            <p className="text-[1rem] text-expresscash-textos font-poppins">
              Email
            </p>
            <p className="text-[1rem] text-expresscash-textos font-poppins"></p>
          </div>
        )}
        {admins.map(admin => {
          return (
            <AdminCard key={admin.id} admin={admin} fetchAdmins={fetchAdmins} />
          );
        })}
        <DataAdmin />
      </div>
    </>
  );
};

export default Setting;

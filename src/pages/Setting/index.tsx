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
      {/* <Modal
        isShown={modalEmail}
        element={
          <div className="px-12 py-[50px] flex flex-col w-[751px] h-[446px]">
            <div className="flex justify-between items-center max-w-[640px] px-2">
              <p className="text-[32px] text-expresscash-textos font-bold pb-6">
                Cambiar email
              </p>
              <p
                className="cursor-pointer"
                onClick={() => setModalEmail(false)}
              >
                <IconX />
              </p>
            </div>

            <div className="flex flex-col gap-10 mx-auto">
              <div className="flex flex-col gap-1">
                <label
                  className="flex items-center gap-2 text-[14px] text-expresscash-textos font-bold"
                  htmlFor=""
                >
                  Email viejo
                </label>
                <input
                  className="w-[625px] h-[54px] rounded-[5px] text-[14px] font-book text-expresscash-textos"
                  type="email"
                  placeholder="maruubc00@gmail.com"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  className="text-[14px] text-expresscash-textos font-bold"
                  htmlFor=""
                >
                  Ingrese nuevo email
                </label>
                <div className="relative w-[625px]">
                  <input
                    className="w-[625px] h-[54px] rounded-[5px] text-[14px] font-book text-expresscash-textos"
                    type="email"
                    placeholder="Email"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-10 max-w-[640px]">
              <button
                onClick={() => setModalEmail(false)}
                className="border-[1px] border-solid border-expresscash-gray w-[109px] h-[38px] rounded-[5px] text-expresscash-gray text-[1rem] font-book"
              >
                Cancelar
              </button>
              <button
                onClick={() => setModalEmail(false)}
                className="bg-expresscash-skyBlue w-[109px] h-[38px] rounded-[5px] text-expresscash-white text-[1rem] font-book"
              >
                Guardar
              </button>
            </div>
          </div>
        }
      ></Modal> */}

      <div className="flex flex-col pl-16 pt-12 px-10 h-[100%] w-[1100px]">
        <p className="text-[3rem] text-expresscash-textos font-bold pb-14">
          Configuración
        </p>
        <CreateAdmin fetchAdmins={fetchAdmins} />

        {admins.length !== 0 && (
          <div className="flex justify-between gap-5 my-8 max-w-[950px]">
            <p className="text-[1rem] text-expresscash-textos font-bold">
              Nombre
            </p>

            <p className="text-[1rem] text-expresscash-textos font-bold">
              Email
            </p>
            <p className="text-[1rem] text-expresscash-textos font-bold"></p>
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

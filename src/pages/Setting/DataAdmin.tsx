import Modal from "@components/Modal";
import { RootState } from "@store";
import { useState } from "react";
import { useSelector } from "react-redux";
import ModalEditAdmin from "./ModalEditAdmin";
import AlertDeleteAdmin from "./AlertDeleteAdmin";

const DataAdmin = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [modalEdit, setModalEdit] = useState<boolean>(false);

  return (
    <>
      <Modal
        isShown={modalDelete}
        element={<AlertDeleteAdmin setModalDelete={setModalDelete} />}
      />
      <Modal
        isShown={modalEdit}
        element={<ModalEditAdmin setModalEdit={setModalEdit} />}
      />
      <div className="mb-10">
        <h4 className="text-[23px] font-bold text-Express-Cash-textos mb-5 mt-8">
          Información de tu cuenta
        </h4>

        <p className="text-[14px] text-Express-Cash-textos font-bold">
          Nombre y Apellido
        </p>
        <input
          className="min-w-[438px] max-w-[438px] rounded-[5px] border-[1px] border-solid border-Express-Cash-gray mt-[11px] text-Express-Cash-textos font-book leading-[23.04px]"
          type="text"
          placeholder={user?.full_name || "Nombre sin registrar"}
          readOnly
        />
        <p className="text-[14px] text-Express-Cash-textos font-bold">Email</p>
        <input
          className="min-w-[438px] max-w-[438px] rounded-[5px] border-[1px] border-solid border-Express-Cash-gray mt-[11px] text-Express-Cash-textos font-book leading-[23.04px]"
          type="email"
          placeholder={user?.email}
          readOnly
        />
        <p className="text-[14px] text-Express-Cash-textos font-bold">
          Contraseña
        </p>
        <input
          className="min-w-[438px] max-w-[438px] rounded-[5px] border-[1px] border-solid border-Express-Cash-gray mt-[11px] text-Express-Cash-textos font-book leading-[23.04px]"
          type="password"
          placeholder="*******************"
          readOnly
        />

        <div className="flex gap-5 mt-10 mb-14">
          <button
            onClick={() => setModalEdit(true)}
            className="flex w-[147px] h-[38px] items-center justify-center bg-Express-Cash-skyBlue text-[1rem] text-Express-Cash-white font-book rounded-[5px] hover:bg-Express-Cash-blue hover:transition-colors duration-100"
          >
            Editar cuenta
          </button>
          <button
            onClick={() => setModalDelete(true)}
            className="flex w-[147px] border-[1px] border-Express-Cash-red h-[38px] items-center justify-center text-[1rem] text-Express-Cash-red font-book rounded-[5px]"
          >
            Eliminar cuenta
          </button>
        </div>
      </div>
    </>
  );
};

export default DataAdmin;

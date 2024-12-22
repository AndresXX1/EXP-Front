import { IconDelete, IconPencil, IconX } from "@utils/svg";
import React, { useState } from "react";
import EditPassword from "./EditPassword";
import Modal from "@components/Modal";
import { AppDispatch, RootState } from "@store";
import { useDispatch, useSelector } from "react-redux";
import { apiUrls } from "@config/config";
import {
  removeMyAvatar,
  updateFullname,
  uploadMyAvatar,
} from "@store/services/admin";
import { getUserAsync } from "@store/actions/auth";

interface ModalEditAdminProps {
  setModalEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalEditAdmin = ({ setModalEdit }: ModalEditAdminProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [modalPassword, setModalPassword] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>(user?.full_name || "");

  const handleEditPhoto = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "nextjs");
      const result = await uploadMyAvatar(formData);
      if (result) {
        dispatch(getUserAsync());
      }
    };
  };

  const handleDeletePhoto = async () => {
    const result = await removeMyAvatar();
    if (result) {
      dispatch(getUserAsync());
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await updateFullname(fullName);
    if (result) {
      dispatch(getUserAsync());
    }
  };

  return (
    <>
      <Modal
        isShown={modalPassword}
        element={<EditPassword setModalPassword={setModalPassword} />}
      />
      <form
        className="px-12 py-[50px] flex flex-col w-[969px] h-[540px] font-poppins"
        onSubmit={handleSubmit}
      >
        <div className="flex justify-between items-center">
          <p className="text-[32px] text-expresscash-textos font-poppins pb-6 ">
            Editar usuario
          </p>
          <p className="cursor-pointer" onClick={() => setModalEdit(false)}>
            <IconX />
          </p>
        </div>
        <div className="flex gap-[50px]">
          <div>
            {user?.avatar && (
              <img
                src={apiUrls.avatarUser(user?.avatar)}
                className="w-[185px] h-[185px] object-cover"
              />
            )}
            <div className="flex gap-2 mt-3 mb-5">
              <p
                className="flex items-center gap-1 text-[14px] text-expresscash-textos font-poppins cursor-pointer"
                onClick={handleEditPhoto}
              >
                <IconPencil />
                Editar foto
              </p>
              <p
                className="flex items-center text-[14px] text-expresscash-red font-poppins cursor-pointer"
                onClick={handleDeletePhoto}
              >
                <IconDelete className="w-[22px] h-[22px]" />
                Eliminar
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-1">
              <label
                className="flex items-center gap-2 text-[14px] text-expresscash-textos font-poppins"
                htmlFor="full_name"
              >
                Nombre y apellido
              </label>
              <input
                className="w-[625px] h-[54px] rounded-[5px] text-[14px] font-poppins text-expresscash-textos"
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                id="full_name"
                placeholder="Nombre y apellido"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                className="text-[14px] text-expresscash-textos font-poppins flex gap-3 items-center "
                htmlFor=""
              >
                Email
              </label>
              <input
                className="w-[625px] h-[54px] rounded-[5px] text-[14px] font-poppins text-expresscash-textos"
                type="text"
                placeholder={user?.email}
                readOnly
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                className="text-[14px] text-expresscash-textos font-poppins flex gap-3 items-center"
                htmlFor=""
              >
                Contraseña
                <p
                  onClick={() => setModalPassword(true)}
                  className="text-expresscash-skyBlue font-light text-[1rem] cursor-pointer"
                >
                  Cambiar contraseña
                </p>
              </label>
              <div className="relative">
                <input
                  className="w-[625px] h-[54px] rounded-[5px] text-[14px] font-poppins text-expresscash-textos"
                  type="text"
                  placeholder="**************"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-10">
          <button
            onClick={() => setModalEdit(false)}
            type="button"
            className="border-[1px] border-solid border-expresscash-gray w-[109px] h-[38px] rounded-[5px] text-expresscash-gray text-[1rem] font-poppins"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-expresscash-skyBlue w-[109px] h-[38px] rounded-[5px] text-expresscash-white text-[1rem] font-poppins hover:bg-expresscash-blue hover:transition-colors duration-100"
          >
            Guardar
          </button>
        </div>
      </form>
    </>
  );
};

export default ModalEditAdmin;

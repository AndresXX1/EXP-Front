import Modal from "@components/Modal";
import { apiUrls } from "@config/config";
import { createAdmin, uploadImgAvatar } from "@store/services/admin";
import { IconDelete, IconEyes, IconPencil, IconUser, IconX } from "@utils/svg";

import { useState } from "react";

interface CreateAdminProps {
  fetchAdmins: () => void;
}

const CreateAdmin = ({ fetchAdmins }: CreateAdminProps) => {
  const [modalCreate, setModalCreate] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [data, setData] = useState({
    full_name: "",
    email: "",
    password: "",
    avatar: "",
  });
  const handlerUploadImageAvatar = async () => {
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
      const result = await uploadImgAvatar(formData);
      if (result) {
        setData({ ...data, avatar: result });
      }
    };
  };
  const handlerChangeData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await createAdmin(data);
    if (response) {
      fetchAdmins();
      setModalCreate(false);
    }
  };
  const handlerOpenModal = () => {
    setData({
      full_name: "",
      email: "",
      password: "",
      avatar: "",
    });
    setModalCreate(true);
  };
  return (
    <>
      <Modal
        isShown={modalCreate}
        element={
          <form
            className="px-12 py-[50px] flex flex-col w-[969px] h-[540px]"
            onSubmit={handlerSubmit}
          >
            <div className="flex justify-between items-center">
              <p className="text-[32px] text-Express-Cash-textos font-bold pb-6">
                Nuevo Administrador
              </p>
              <p
                className="cursor-pointer"
                onClick={() => setModalCreate(false)}
              >
                <IconX />
              </p>
            </div>
            <div className="flex gap-[50px]">
              <div>
                <div className="flex items-center justify-center rounded-[13px] w-[185px] h-[185px] bg-Express-Cash-gray3 border-[1px] border-solid border-Express-Cash-gray2">
                  <img
                    src={
                      data.avatar
                        ? apiUrls.avatarUser(data.avatar)
                        : "/products/image_default.png"
                    }
                    className="w-[84px] h-[84px] object-cover"
                  />
                </div>
                <div className="flex gap-2 mt-3 mb-5">
                  <p
                    className="flex items-center gap-1 text-[14px] text-Express-Cash-textos font-book cursor-pointer"
                    onClick={handlerUploadImageAvatar}
                  >
                    <IconPencil />
                    Editar foto
                  </p>
                  <p
                    className="flex items-center text-[14px] text-Express-Cash-red font-book cursor-pointer"
                    onClick={() => setData({ ...data, avatar: "" })}
                  >
                    <IconDelete className="w-[22px] h-[22px]" />
                    Eliminar
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-1">
                  <label
                    className="flex items-center gap-2 text-[14px] text-Express-Cash-textos font-bold"
                    htmlFor="full_name"
                  >
                    Nombre y apellido
                  </label>
                  <input
                    name="full_name"
                    value={data.full_name}
                    onChange={handlerChangeData}
                    id="full_name"
                    className="w-[625px] h-[54px] rounded-[5px] text-[14px] font-book text-Express-Cash-textos"
                    type="text"
                    placeholder="Nombre y Apellido"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    className="text-[14px] text-Express-Cash-textos font-bold flex gap-3 items-center"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    name="email"
                    value={data.email}
                    onChange={handlerChangeData}
                    id="email"
                    className="w-[625px] h-[54px] rounded-[5px] text-[14px] font-book text-Express-Cash-textos"
                    type="email"
                    required
                    placeholder="Email"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    className="text-[14px] text-Express-Cash-textos font-bold flex gap-3 items-center"
                    htmlFor="password"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      value={data.password}
                      onChange={handlerChangeData}
                      id="password"
                      className="w-[625px] h-[54px] rounded-[5px] text-[14px] font-book text-Express-Cash-textos"
                      type={showPassword ? "text" : "password"}
                      placeholder="Contraseña"
                      required
                    />
                    <div
                      className="absolute right-4 top-5 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <IconEyes />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-10">
              <button
                type="button"
                onClick={() => setModalCreate(false)}
                className="border-[1px] border-solid border-Express-Cash-gray w-[109px] h-[38px] rounded-[5px] text-Express-Cash-gray text-[1rem] font-book"
              >
                Cancelar
              </button>
              <button
                className="bg-Express-Cash-skyBlue w-[109px] h-[38px] rounded-[5px] text-Express-Cash-white text-[1rem] font-book"
                type="submit"
              >
                Guardar
              </button>
            </div>
          </form>
        }
      />
      <div className="flex justify-between">
        <h4 className="text-[23px] font-bold text-Express-Cash-textos mb-5">
          Permisos de administrador
        </h4>

        <button
          onClick={handlerOpenModal}
          className="w-[228px] h-[54px] bg-Express-Cash-skyBlue rounded-[13px] flex items-center justify-center text-Express-Cash-white gap-2 text-[15.36px] font-book hover:bg-Express-Cash-blue hover:transition-colors duration-100"
        >
          <IconUser className="w-[20px] h-[20px]" color="#FFFFFF" />
          Nuevo administrador
        </button>
      </div>
    </>
  );
};

export default CreateAdmin;

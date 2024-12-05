import { updatePassword } from "@store/services/admin";
import { IconEyes, IconEyesOff, IconX } from "@utils/svg";
import React, { useState } from "react";

interface EditPasswordProps {
  setModalPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditPassword = ({ setModalPassword }: EditPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    new_password: "",
    password: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await updatePassword(data);
    if (response) {
      setModalPassword(false);
    }
  };
  return (
    <form
      className="px-12 py-[50px] flex flex-col w-[751px] h-[446px]"
      onSubmit={handleSubmit}
    >
      <div className="flex justify-between items-center max-w-[640px] px-2">
        <p className="text-[32px] text-expresscash-textos font-bold pb-6">
          Cambiar contraseña
        </p>
        <p className="cursor-pointer" onClick={() => setModalPassword(false)}>
          <IconX />
        </p>
      </div>

      <div className="flex flex-col gap-10 mx-auto">
        <div className="flex flex-col gap-1">
          <label
            className="flex items-center gap-2 text-[14px] text-expresscash-textos font-bold"
            htmlFor="password"
          >
            Contraseña vieja
          </label>
          <input
            className="w-[625px] h-[54px] rounded-[5px] text-[14px] font-book text-expresscash-textos"
            type="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            id="password"
            placeholder="*********"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            className="text-[14px] text-expresscash-textos font-bold"
            htmlFor="new_password"
          >
            Ingrese nueva contraseña
          </label>
          <div className="relative w-[625px]">
            <input
              name="new_password"
              value={data.new_password}
              onChange={handleChange}
              id="new_password"
              required
              className="w-[625px] h-[54px] rounded-[5px] text-[14px] font-book text-expresscash-textos"
              type={showPassword ? "text" : "password"}
              placeholder="**************"
            />
            <div
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-5 cursor-pointer"
            >
              {showPassword ? <IconEyesOff /> : <IconEyes />}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-10 max-w-[640px]">
        <button
          type="button"
          onClick={() => setModalPassword(false)}
          className="border-[1px] border-solid border-expresscash-gray w-[109px] h-[38px] rounded-[5px] text-expresscash-gray text-[1rem] font-book"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-expresscash-skyBlue w-[109px] h-[38px] rounded-[5px] text-expresscash-white text-[1rem] font-book hover:bg-expresscash-blue hover:transition-colors duration-100"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};

export default EditPassword;

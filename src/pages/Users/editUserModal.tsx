/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { IconEdit, IconX } from "@utils/svg";
import Modal from "@components/Modal";
import { apiUrls, tokenAccess } from "@config/config";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import axios from "axios";
import UserAddresses from "./allAddress";
import { alertError, alertConfirm } from "@utils/alerts";

interface Address {
  street: string;
  number: number;
  zipCode: string;
  city: string;
  province: string;
}

export interface UserFormData {
  avatar: string;
  id: number;
  cuil: string;
  gender: string;
  subscriptionStatus: string | number | readonly string[] | undefined;
  firstName: string;
  lastName: string;
  phone: string;
  birthday: string;
  points: number;
  image: string;
  address: Address[];
}

interface EditUserModalProps {
  user: UserFormData;
  onSave: (user: UserFormData) => void;
  onClose: () => void;
  userToEdit?: UserFormData;
  setModalEdit: Dispatch<SetStateAction<boolean>>;
  getUsersList: () => Promise<void>;
  onAddressChange: (field: keyof Address, value: string | number) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  onSave,
  onClose,
  getUsersList,
}) => {
  const [formData, setFormData] = useState<UserFormData>(user);
  const [addressToEdit, setAddressToEdit] = useState<Address[]>(
    user.address || []
  );
  const [formErrors, setFormErrors] = useState<Partial<UserFormData>>({});
  const { updatingUser } = useSelector((state: RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setFormData(prevData => ({
      ...prevData,
      cuil: user.cuil ? String(user.cuil) : "",
      gender: user.gender || "Seleccionar",
      address:
        prevData.address.length === 0
          ? [{ street: "", number: 0, zipCode: "", city: "", province: "" }]
          : prevData.address,
    }));
  }, [user]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "firstName") {
      if (/[^a-zA-ZáéíóúÁÉÍÓÚ\s]/.test(value)) {
        setFormErrors(prevErrors => ({
          ...prevErrors,
          [name]: "Solo se permiten letras",
        }));
      } else {
        setFormErrors(prevErrors => {
          const { [name]: _, ...rest } = prevErrors;
          return rest;
        });
      }
    }

    setFormData(prevData => ({
      ...prevData,
      [name]: name === "points" ? Number(value) : value,
    }));

    if (formErrors[name as keyof UserFormData]) {
      const newErrors = { ...formErrors };
      delete newErrors[name as keyof UserFormData];
      setFormErrors(newErrors);
    }
  };
  const handleAddressChange = (
    index: number,
    field: keyof Address,
    value: string | number
  ) => {
    const updatedAddresses = [...addressToEdit];
    updatedAddresses[index] = { ...updatedAddresses[index], [field]: value };
    setAddressToEdit(updatedAddresses);
  };

  const validateUserFields = (userData: {
    firstName: string;
    lastName: string;
    cuil: string;
    birthday: string;
    phone: string;
  }) => {
    const errors: Partial<typeof userData> = {};

    if (!userData.firstName) {
      errors.firstName = "El nombre es obligatorio.";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/.test(userData.firstName)) {
      errors.firstName =
        "El nombre debe contener solo letras, entre 2 y 50 caracteres.";
    }

    if (!userData.lastName) {
      errors.lastName = "El apellido es obligatorio.";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/.test(userData.lastName)) {
      errors.lastName =
        "El apellido debe contener solo letras, entre 2 y 50 caracteres.";
    }

    if (!userData.phone) {
      errors.phone = "El teléfono es obligatorio.";
    } else if (!/^[+]?[0-9]{8,15}$/.test(userData.phone)) {
      errors.phone =
        "El teléfono debe contener entre 8 y 15 dígitos, puede incluir un signo + inicial.";
    }

    if (!userData.cuil) {
      errors.cuil = "El CUIL es obligatorio.";
    } else if (!/^\d{11}$/.test(userData.cuil)) {
      errors.cuil =
        "El CUIL debe tener el once caracteres XXXXXXXXXXX (sin guiones).";
    }

    if (!userData.birthday) {
      errors.birthday = "La fecha de nacimiento es obligatoria.";
    } else {
      const birthDate = new Date(userData.birthday);
      const today = new Date();
      const minAge = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );

      if (birthDate > today) {
        errors.birthday = "La fecha de nacimiento no puede ser en el futuro.";
      } else if (birthDate > minAge) {
        errors.birthday = "Debe ser mayor de 18 años.";
      }
    }

    return errors;
  };

  const handleSave = async () => {
    const userData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      cuil: String(formData.cuil),
      birthday: formData.birthday || "",
      phone: formData.phone,
      gender: formData.gender,
    };

    const validationErrors = validateUserFields({
      firstName: userData.first_name,
      lastName: userData.last_name,
      cuil: userData.cuil,
      birthday: userData.birthday,
      phone: userData.phone,
    });

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);

      const firstError = Object.values(validationErrors)[0];
      alertError(firstError);
      return;
    }

    if (!userData.birthday) {
      alertError("El campo de fecha de nacimiento es obligatorio.");
      return;
    }

    const formattedBirthday = new Date(userData.birthday)
      .toISOString()
      .split("T")[0];

    const finalUserData = {
      ...userData,
      birthday: formattedBirthday,
      points: formData.points,
    };

    const token = localStorage.getItem(tokenAccess.tokenName);

    if (!token) {
      alertError("No se encontró el token de autenticación.");
      return;
    }

    try {
      const response = await axios.put(
        `${apiUrls.putUserById(user.id)}`,
        finalUserData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.ok) {
        alertConfirm("Datos del usuario actualizados correctamente.");
        onSave(response.data.updatedUser);

        if (getUsersList) {
          await getUsersList();
        }

        onClose();
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      alertError("Ocurrió un error al intentar actualizar los datos.");
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleKeydown = (e: { key: string; preventDefault: () => void }) => {
    if (
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      !/^[A-Za-záéíóúÁÉÍÓÚ\s]$/.test(e.key)
    ) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: {
    preventDefault: () => void;
    clipboardData: { getData: (arg0: string) => any };
  }) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const cleanedText = pastedText.replace(/[^A-Za-záéíóúÁÉÍÓÚ\s]/g, "");
    setFormData(prev => ({ ...prev, firstName: prev.firstName + cleanedText }));
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const cleanedValue = value.replace(/[^0-9+]/g, "");
    setFormData(prev => ({ ...prev, phone: cleanedValue }));
  };

  const handlePhoneKeydown = (e: {
    key: string;
    preventDefault: () => void;
  }) => {
    if (
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      !/^[0-9+]$/.test(e.key)
    ) {
      e.preventDefault();
    }
  };

  const handlePhonePaste = (e: {
    preventDefault: () => void;
    clipboardData: { getData: (arg0: string) => any };
  }) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const cleanedText = pastedText.replace(/[^0-9+]/g, "");
    setFormData(prev => ({ ...prev, phone: prev.phone + cleanedText }));
  };

  const handleCUILInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const cleanedValue = value.replace(/[^0-9]/g, "");
    setFormData(prev => ({ ...prev, cuil: cleanedValue }));
  };

  const handleCUILKeydown = (e: {
    key: string;
    preventDefault: () => void;
  }) => {
    if (e.key !== "Backspace" && e.key !== "Delete" && !/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleCUILPaste = (e: {
    preventDefault: () => void;
    clipboardData: { getData: (arg0: string) => any };
  }) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const cleanedText = pastedText.replace(/[^0-9]/g, "");
    setFormData(prev => ({ ...prev, cuil: prev.cuil + cleanedText }));
  };

  console.log("aca", user.image);
  console.log("Imagen del usuario:", user.image);
  console.log(
    "Imagen de avatar:",
    apiUrls.avatarUser(user.avatar || "default-avatar.png")
  );
  console.log(
    "Imagen a renderizar:",
    apiUrls.avatarUser(user.image || "default-avatar.png")
  );
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2.5 z-50">
      <div className="bg-white rounded-lg  w-[950px] h-[auto] relative z-50">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
        >
          <IconX />
        </button>

        <div className="p-5">
          <h1 className="text-lg mb-3">Editar usuario {user.firstName}</h1>
          <div className="grid grid-cols-[0.7fr_1fr_1fr] gap-4">
            <div className="w-[144px] translate-y-[35px] translate-x-[40px]">
              <div className="rounded-[11px] w-[140px] h-[152px] bg-expresscash-gray3 border border-expresscash-gray2 mb-12">
                <img
                  className="w-full h-full object-cover rounded-[11px]"
                  src={
                    user.image ||
                    `https://back5.maylandlabs.com/avatar/${user.image}`
                  }
                  alt={user.firstName}
                />
                <button
                  onClick={handleOpenModal}
                  className="flex items-center cursor-pointer text-gray-700 w-[500px] truncate  translate-y-[30px]"
                >
                  <IconEdit />
                  Direcciones
                </button>
              </div>
            </div>

            <div className="col-span-2 grid grid-cols-2 gap-x-6 gap-y-2.5 mt-2.5">
              <div>
                <label className="block text-sm text-gray-700 mb-0.5">
                  Nombre
                </label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  maxLength={12}
                  onChange={handleInputChange}
                  onKeyDown={handleKeydown}
                  onPaste={handlePaste}
                  pattern="[A-Za-záéíóúÁÉÍÓÚ\s]+"
                  title="Solo letras y espacios son permitidos"
                  className={`w-[300px] h-[54px] rounded-[5px] border-[1px] border-solid ${formErrors.firstName ? "border-red-500" : "border-expresscash-gray"}`}
                />
                {formErrors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-0.5">
                  Apellido
                </label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  maxLength={12}
                  onKeyDown={handleKeydown}
                  onPaste={handlePaste}
                  onChange={handleInputChange}
                  className={`w-[300px] h-[54px] rounded-[5px] border-[1px] border-solid ${formErrors.lastName ? "border-red-500" : "border-expresscash-gray"}`}
                />
                {formErrors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.lastName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-0.5 mt-[20px]">
                  Teléfono
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneInput}
                  onKeyDown={handlePhoneKeydown}
                  onPaste={handlePhonePaste}
                  maxLength={15}
                  pattern="[0-9+]{8,15}"
                  title="Teléfono válido (8-15 dígitos, puede incluir +)"
                  className={`w-[300px] h-[54px] rounded-[5px] border-[1px] border-solid ${formErrors.phone ? "border-red-500" : "border-expresscash-gray"}`}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-0.5 mt-[20px]">
                  Cuil
                </label>
                <input
                  name="cuil"
                  value={formData.cuil || ""}
                  onChange={handleCUILInput}
                  onKeyDown={handleCUILKeydown}
                  onPaste={handleCUILPaste}
                  maxLength={11}
                  pattern="[0-9]{11}"
                  title="CUIL válido (11 dígitos)"
                  className={`w-[300px] h-[54px] rounded-[5px] border-[1px] border-solid ${formErrors.cuil ? "border-red-500" : "border-expresscash-gray"}`}
                />
                {formErrors.cuil && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.cuil}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-0.5 mt-[20px]">
                  Fecha de nacimiento
                </label>
                <input
                  name="birthday"
                  type="date"
                  value={formData.birthday || ""}
                  onChange={handleInputChange}
                  className={`w-[300px] h-[54px] rounded-[5px] border-[1px] border-solid ${formErrors.birthday ? "border-red-500" : "border-expresscash-gray"}`}
                />
                {formErrors.birthday && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.birthday}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-0.5 mt-[20px]">
                  Puntos
                </label>
                <input
                  name="points"
                  type="number"
                  value={formData.points}
                  maxLength={6}
                  min={0}
                  max={99999}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    const cleanedValue = parseInt(
                      value.replace(/[^0-9]/g, ""),
                      10
                    );
                    setFormData(prev => ({
                      ...prev,
                      points: Math.max(0, Math.min(cleanedValue, 99999)),
                    }));
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Backspace") return;
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e: React.ClipboardEvent) => {
                    e.preventDefault();
                    const pastedText = e.clipboardData.getData("text");
                    const cleanedValue = parseInt(
                      pastedText.replace(/[^0-9]/g, ""),
                      10
                    );
                    setFormData(prev => ({
                      ...prev,
                      points: Math.max(0, Math.min(cleanedValue, 99999)),
                    }));
                  }}
                  className="w-[300px] h-[54px] px-2.5 border rounded-md"
                />
              </div>
            </div>
          </div>

          {isModalOpen && (
            <Modal
              isShown={isModalOpen}
              closeModal={handleCloseModal}
              element={
                <UserAddresses
                  userId={user.id}
                  user={user}
                  onEdit={(address, index) => {
                    handleAddressChange(index, "street", address.street);
                    handleAddressChange(index, "number", address.number);
                    handleAddressChange(index, "zipCode", address.zipCode);
                    handleAddressChange(index, "city", address.city);
                    handleAddressChange(index, "province", address.province);
                  }}
                  onDelete={index => {
                    const updatedAddresses = addressToEdit.filter(
                      (_, i) => i !== index
                    );
                    setAddressToEdit(updatedAddresses);
                  }}
                  onClose={handleCloseModal}
                  userFormData={user}
                />
              }
            />
          )}

          <div className="flex gap-3 justify-end mt-[35px]">
            <div>
              <button
                onClick={onClose}
                className="border-[1px] border-solid border-expresscash-gray w-[109px] h-[38px] rounded-[5px] text-expresscash-gray text-[1rem] font-book"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="bg-expresscash-skyBlue w-[109px] h-[38px] rounded-[5px] text-expresscash-white text-[1rem] font-book hover:bg-argentpesos-blue hover:transition-colors duration-100"
                disabled={updatingUser}
              >
                {updatingUser ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

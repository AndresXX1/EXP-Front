/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconPencil } from "@utils/svg";
import React, { useState } from "react";

interface CreateUserFormProps {
  onClose: () => void;
  onSave: (formData: any) => void;
}

interface FormData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  cuil?: string;
  birthday?: string;
  points?: number;
  image?: string;
  address?: {
    street?: string;
    number?: string;
    zipCode?: string;
    city?: string;
    province?: string;
  };
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onClose, onSave }) => {
  const [userStatus] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    image: "",
    lastName: "",
    phone: "",
    cuil: "",
    birthday: "",
    points: 0,
    address: {
      street: "",
      number: "",
      zipCode: "",
      city: "",
      province: "",
    },
  });
  const provinces = ["Buenos Aires", "CABA", "Santa Fe", "Cordoba"];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes(".")
        ? { ...prev.address, [name.split(".")[1]]: value }
        : value,
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.firstName) errors.firstName = "El nombre es obligatorio";
    if (!formData.lastName) errors.lastName = "El apellido es obligatorio";
    if (!formData.phone) errors.phone = "El teléfono es obligatorio";
    if (!formData.cuil) errors.cuil = "El CUIL es obligatorio";
    if (!formData.birthday)
      errors.birthday = "La fecha de nacimiento es obligatoria";
    if (!formData.address?.street)
      errors.street = "La dirección es obligatoria";
    if (!formData.address?.number) errors.number = "El número es obligatorio";

    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      onSave(formData);
    } else {
      setFormErrors(errors);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData(prevState => ({
        ...prevState,
        image: previewUrl,
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl relative z-50 overflow-hidden min-h-[620px]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          X
        </button>

        <form className="p-6" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-poppins mb-6">Crear nuevo usuario</h1>

          <div className="grid grid-cols-3 gap-6">
            {/* Columna de Imagen */}
            <div className="col-span-1">
              <img
                className="w-full h-[230px] object-cover rounded-lg shadow-md"
                src={formData.image || "/login/defaultUser1.jpeg"}
                alt={formData.firstName || "Avatar del usuario"}
              />

              <p
                className="flex gap-1 items-center w-[140px] mt-[10px] ml-[60px]  text-[18px] font-poppins text-expresscash-textos cursor-pointer transition-transform duration-300 ease-in-out hover:text-expresscash-skyBlue  hover:scale-105 hover:brightness-110"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                <div className="transition-colors duration-300 ease-in-out hover:text-expresscash-skyBlue font-poppins">
                  <IconPencil />
                </div>{" "}
                {userStatus ? "Cargar Foto" : "Añadir foto"}
              </p>

              <input
                id="image-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </div>
            {/* Columna de Formulario de Inputs - Izquierda */}
            <div className="col-span-1 space-y-4">
              <div>
                <label className="block text-sm font-poppins font-bold text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-md border font-poppins ${formErrors.firstName ? "border-red-500" : "border-gray-300"}`}
                />
                {formErrors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold font-poppins text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-md border font-poppins ${formErrors.phone ? "border-red-500" : "border-gray-300"}`}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold font-poppins text-gray-700 mb-1">
                  Fecha de nacimiento
                </label>
                <input
                  name="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-md border font-poppins ${formErrors.birthday ? "border-red-500" : "border-gray-300"}`}
                />
                {formErrors.birthday && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.birthday}
                  </p>
                )}
              </div>
            </div>

            {/* Columna de Formulario de Inputs - Derecha */}
            <div className="col-span-1 space-y-4">
              <div>
                <label className="block text-sm font-bold font-poppins text-gray-700 mb-1">
                  Apellido
                </label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-md border font-poppins ${formErrors.lastName ? "border-red-500" : "border-gray-300"}`}
                />
                {formErrors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.lastName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold font-poppins text-gray-700 mb-1">
                  CUIL
                </label>
                <input
                  name="cuil"
                  value={formData.cuil}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-md border font-poppins ${formErrors.cuil ? "border-red-500" : "border-gray-300"}`}
                />
                {formErrors.cuil && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.cuil}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold font-poppins text-gray-700 mb-1">
                  Puntos
                </label>
                <input
                  name="points"
                  type="number"
                  value={formData.points}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-md border font-poppins ${formErrors.points ? "border-red-500" : "border-gray-300"}`}
                />
                {formErrors.points && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.points}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 mt-[-20px]"></h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold font-poppins text-gray-700 mb-1">
                  Calle
                </label>
                <input
                  type="text"
                  maxLength={20}
                  value={formData.address?.street || ""}
                  onChange={e => handleAddressChange("street", e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border font-poppins ${formErrors.street ? "border-red-500" : "border-gray-300"}`}
                />
                {formErrors.street && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.street}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold font-poppins text-gray-700 mb-1">
                  Número
                </label>
                <input
                  type="number"
                  value={formData.address?.number ?? ""}
                  onChange={e => handleAddressChange("number", e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border ${formErrors.number ? "border-red-500" : "border-gray-300"}`}
                />
                {formErrors.number && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.number}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold font-poppins text-gray-700 mb-1">
                  Código Postal
                </label>
                <input
                  type="text"
                  maxLength={5}
                  value={formData.address?.zipCode}
                  onChange={e => handleAddressChange("zipCode", e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border font-poppins ${formErrors.zipCode ? "border-red-500" : "border-gray-300"}`}
                />
                {formErrors.zipCode && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.zipCode}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold font-poppins text-gray-700 mb-1">
                  Ciudad
                </label>
                <input
                  type="text"
                  maxLength={12}
                  value={formData.address?.city || ""}
                  onChange={e => handleAddressChange("city", e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border ${formErrors.city ? "border-red-500" : "border-gray-300"}`}
                />
                {formErrors.city && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-bold font-poppins text-gray-700 mb-1">
                  Provincia
                </label>
                <select
                  value={formData.address?.province}
                  onChange={e =>
                    handleAddressChange("province", e.target.value)
                  }
                  className={`w-full px-3 py-2 rounded-md border font-poppins ${formErrors.province ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Seleccione una provincia</option>
                  {provinces.map((province, idx) => (
                    <option key={idx} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
                {formErrors.province && (
                  <p className="text-red-500 text-xs mt-1 font-poppins">
                    {formErrors.province}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md font-poppins font-bold text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-expresscash-skyBlue rounded-md font-poppins text-white hover:bg-opacity-90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserForm;

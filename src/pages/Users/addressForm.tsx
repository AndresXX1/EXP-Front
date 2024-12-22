/* eslint-disable @typescript-eslint/no-explicit-any */
import Modal from "@components/Modal";
import { RootState } from "@store";
import { IconX } from "@utils/svg";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@store";
import { createAddressAsync } from "../../store/actions/user";
import { Address } from "../../store/types/user";

// Propiedades que recibe el componente
interface AddressFormProps {
  address: Address;
  onAddressChange: (field: keyof Address, value: string | number) => void;
  onSave?: () => void;
  onCancel?: () => void;
  userFormData: any;
}

const AddressForm: React.FC<AddressFormProps> = ({
  address,
  onAddressChange,
  onSave,
  onCancel,
  userFormData,
}) => {
  const { loading, error } = useSelector((state: RootState) => ({
    loading: state.Product.loading,
    error: state.Product.error,
  }));

  const [modalCanceled, setModalCanceled] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<Address>>({});
  const dispatch = useDispatch<AppDispatch>();

  const validateAddressFields = (addressToValidate: Address) => {
    const newErrors: Partial<Address> = {};

    if (!addressToValidate.street) {
      newErrors.street = "La dirección es obligatoria.";
    } else if (!/^[a-zA-Z\s]*$/.test(addressToValidate.street)) {
      newErrors.street = "La dirección solo puede contener letras y espacios.";
    } else if (addressToValidate.street.length > 25) {
      newErrors.street = "La dirección no puede tener más de 25 caracteres.";
    }

    if (
      !addressToValidate.zipCode ||
      !/^[A-Za-z]{1}\d{4,5}$/.test(addressToValidate.zipCode)
    ) {
      newErrors.zipCode =
        "El código postal debe tener un carácter seguido de 4-5 números.";
    }

    if (!addressToValidate.city) {
      newErrors.city = "La ciudad es obligatoria.";
    } else if (!/^[a-zA-Z\s]*$/.test(addressToValidate.city)) {
      newErrors.city = "La ciudad solo puede contener letras y espacios.";
    } else if (addressToValidate.city.length > 12) {
      newErrors.city = "La ciudad no puede tener más de 12 caracteres.";
    }

    if (!addressToValidate.province) {
      newErrors.province = "La provincia es obligatoria.";
    }

    return newErrors;
  };

  const handleCancel = () => {
    setModalCanceled(true); // Esto debería activar el modal
  };

  const closeCancelModal = () => {
    setModalCanceled(false);
  };

  const handleConfirmCancel = () => {
    setModalCanceled(false);
    if (onCancel) {
      onCancel();
    }
  };

  const provinces = [
    "Buenos Aires",
    "Ciudad Autónoma de Buenos Aires",
    "Catamarca",
    "Chaco",
    "Chubut",
    "Córdoba",
    "Corrientes",
    "Entre Ríos",
    "Formosa",
    "Jujuy",
    "La Pampa",
    "La Rioja",
    "Mendoza",
    "Misiones",
    "Neuquén",
    "Río Negro",
    "Salta",
    "San Juan",
    "San Luis",
    "Santa Cruz",
    "Santa Fe",
    "Santiago del Estero",
    "Tierra del Fuego",
    "Tucumán",
  ];

  const handleFieldChange = (field: keyof Address, value: string | number) => {
    onAddressChange(field, value);
    const newErrors = validateAddressFields({ ...address, [field]: value });
    setErrors(newErrors);
  };

  const handleSave = async () => {
    const validationErrors = validateAddressFields(address);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const newAddress = {
        street: address.street,
        number: address.number,
        zipCode: address.zipCode,
        city: address.city,
        province: address.province,
      };

      await dispatch(
        createAddressAsync({ userId: userFormData.id, address: newAddress })
      );

      if (onSave) onSave(); // Llama la función onSave si existe
    } catch (error) {
      console.error("Error al crear la dirección", error);
    }
  };

  return (
    <>
      <Modal
        isShown={modalCanceled}
        element={
          <div className="px-6 py-6 flex flex-col justify-center gap-5 w-[481px] h-[192px]">
            <div className="flex justify-between items-center">
              <p className="text-[1rem] text-expresscash-textos font-poppins">
                ¿Está seguro que desea salir?
              </p>
              <p className="cursor-pointer" onClick={closeCancelModal}>
                <IconX />
              </p>
            </div>
            <p className="text-[14px] font-poppins text-expresscash-gray w-[380px]">
              Se descartarán los cambios realizados.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleConfirmCancel}
                className="bg-expresscash-red w-[109px] h-[38px] rounded-[5px] text-expresscash-white text-[1rem] font-poppins"
              >
                Salir
              </button>
              <button
                onClick={closeCancelModal}
                className="border-[1px] border-solid border-expresscash-gray w-[109px] h-[38px] rounded-[5px] text-expresscash-gray text-[1rem] font-poppins"
              >
                Cancelar
              </button>
            </div>
          </div>
        }
      />

      {/* Formulario de Dirección */}
      <div className="space-y-4 max-w-4xl mx-auto w-[700px] h-[480px]">
        <div className="flex justify-between items-center">
          <p className="cursor-pointer" onClick={handleCancel}>
            <IconX />
          </p>
        </div>

        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-10">
          {address
            ? `Crear Dirección para ${userFormData.firstName} ${userFormData.lastName}`
            : "Agregar Dirección"}
        </h2>

        <div className="grid grid-cols-2 gap-x-4 ml-10">
          <div>
            <label className="block text-sm text-gray-700 mb-0.5">
              Dirección
            </label>
            <input
              type="text"
              maxLength={20}
              value={address.street}
              onChange={e => handleFieldChange("street", e.target.value)}
              className={`w-[300px] h-[54px] rounded-[5px] border-[1px] border-solid ${errors.street ? "border-red-500" : "border-expresscash-gray"}`}
              placeholder="Ejemplo: Calle Falsa 123"
              aria-label="Dirección"
            />
            {errors.street && (
              <p className="text-red-500 text-xs w-[300px]">{errors.street}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-0.5">Número</label>
            <input
              type="number"
              value={address.number}
              onChange={e =>
                handleFieldChange("number", Number(e.target.value))
              }
              className={`w-[300px] h-[54px] rounded-[5px] border-[1px] border-solid ${errors.number ? "border-red-500" : "border-expresscash-gray"}`}
              maxLength={4}
              placeholder="Ej: 825"
              aria-label="Número"
              onKeyDown={e => {
                // Prevenir que se peguen números de más de 4 dígitos
                if (
                  (e.key === "v" || e.key === "V") &&
                  (e.ctrlKey === true || e.metaKey === true)
                ) {
                  e.preventDefault();
                }
              }}
            />
            {errors.number && (
              <p className="text-red-500 text-xs w-[300px]">{errors.number}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 ml-10">
          <div>
            <label className="block text-sm text-gray-700 mb-0.5">
              Código Postal
            </label>
            <input
              type="text"
              maxLength={5}
              value={address.zipCode}
              onChange={e => handleFieldChange("zipCode", e.target.value)}
              className={`w-[300px] h-[54px] rounded-[5px] border-[1px] border-solid ${errors.zipCode ? "border-red-500" : "border-expresscash-gray"}`}
              placeholder="Ej: B1702"
              aria-label="Código Postal"
            />
            {errors.zipCode && (
              <p className="text-red-500 text-xs w-[300px]">{errors.zipCode}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-0.5">Ciudad</label>
            <input
              type="text"
              maxLength={12}
              value={address.city}
              onChange={e => handleFieldChange("city", e.target.value)}
              className={`w-[300px] h-[54px] rounded-[5px] border-[1px] border-solid ${errors.city ? "border-red-500" : "border-expresscash-gray"}`}
              placeholder="Ej: Buenos Aires"
              aria-label="Ciudad"
            />
            {errors.city && (
              <p className="text-red-500 text-xs w-[300px]">{errors.city}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 ml-10">
          <div>
            <label className="block text-sm text-gray-700 mb-0.5">
              Provincia
            </label>
            <select
              value={address.province}
              onChange={e => handleFieldChange("province", e.target.value)}
              className={`w-[640px]  h-[54px] rounded-[5px] border-[1px] border-solid ${errors.province ? "border-red-500" : "border-expresscash-gray"}`}
              aria-label="Provincia"
            >
              <option value="">Seleccione una provincia</option>{" "}
              {/* Valor vacío para el placeholder */}
              {provinces.map((provincia, index) => (
                <option key={index} value={provincia}>
                  {provincia}
                </option>
              ))}
            </select>
            {errors.province && (
              <p className="text-red-500 text-xs w-[300px]">
                {errors.province}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <div className="flex justify-end gap-4 mt-10">
            <button
              onClick={handleCancel}
              className="border-[1px] border-solid border-expresscash-gray w-[109px] h-[38px] rounded-[5px] text-expresscash-gray text-[1rem] font-poppins"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="bg-expresscash-skyBlue w-[109px] h-[38px] rounded-[5px] text-expresscash-white text-[1rem] font-poppins hover:bg-expresscash-blue hover:transition-colors duration-100"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default AddressForm;

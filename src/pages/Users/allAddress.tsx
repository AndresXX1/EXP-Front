import Modal from "@components/Modal";
import { RootState } from "@store";
import { IconX, IconEdit, IconDelete } from "@utils/svg";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@store";
import {
  getUserAddressesAsync,
  deleteAddressAsync,
  editAddressAsync,
} from "../../store/actions/user";
import { UserFormData } from "./editUserModal";
import { Address, Address as AddressType } from "../../store/types/user";
import AddressForm from "./addressForm";

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

interface UserAddressesProps {
  userId: number;
  user: UserFormData;
  onEdit: (address: Address, index: number) => void;
  onDelete: (index: number) => void;
  onClose: () => void;
  userFormData: UserFormData;
}

const AllAddress: React.FC<UserAddressesProps> = ({
  userId,
  user,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { addresses, loading, error } = useSelector((state: RootState) => ({
    addresses: state.address.addresses,
    loading: state.address.loading,
    error: state.address.error,
  }));

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<AddressType | null>(null);
  const [addressToEditIndex, setAddressToEditIndex] = useState<number | null>(
    null
  );
  const [modalCanceled, setModalCanceled] = useState<boolean>(false);
  const [showAddressFormModal, setShowAddressFormModal] = useState(false);
  const [newAddress, setNewAddress] = useState<AddressType>({
    street: "",
    number: 0,
    zipCode: "",
    city: "",
    province: "",
  });

  const [errors, setErrors] = useState({
    street: "",
    number: "",
    zipCode: "",
    city: "",
    province: "",
  });

  useEffect(() => {
    dispatch(getUserAddressesAsync(userId));
  }, [dispatch, userId]);

  // Validación unificada para direcciones nuevas y editadas
  const validateAddressFields = (addressToValidate: AddressType) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newErrors: any = {};

    // Validación de dirección
    if (!addressToValidate.street) {
      newErrors.street = "La dirección es obligatoria.";
    } else if (!/^[a-zA-Z\s]*$/.test(addressToValidate.street)) {
      newErrors.street = "La dirección solo puede contener letras y espacios.";
    } else if (addressToValidate.street.length > 25) {
      newErrors.street = "La dirección no puede tener más de 25 caracteres.";
    }

    // Validación de número
    if (!addressToValidate.number) {
      newErrors.number = "El número es obligatorio.";
    } else if (!/^\d{1,4}$/.test(addressToValidate.number.toString())) {
      newErrors.number =
        "El número debe ser un valor numérico de hasta 4 dígitos.";
    }

    // Validación de código postal
    if (
      !addressToValidate.zipCode ||
      !/^[A-Za-z]{1}\d{4,5}$/.test(addressToValidate.zipCode)
    ) {
      newErrors.zipCode =
        "El código postal debe tener un carácter seguido de 4-5 números.";
    }

    // Validación de ciudad
    if (!addressToValidate.city) {
      newErrors.city = "La ciudad es obligatoria.";
    } else if (!/^[a-zA-Z\s]*$/.test(addressToValidate.city)) {
      newErrors.city = "La ciudad solo puede contener letras y espacios.";
    } else if (addressToValidate.city.length > 12) {
      newErrors.city = "La ciudad no puede tener más de 12 caracteres.";
    }

    // Validación de provincia
    if (!addressToValidate.province) {
      newErrors.province = "La provincia es obligatoria.";
    }

    return newErrors;
  };

  const handleDelete = (index: number) => {
    setAddressToDelete(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (addressToDelete !== null) {
      try {
        await dispatch(deleteAddressAsync({ userId, index: addressToDelete }));
        dispatch(getUserAddressesAsync(userId));
        setShowDeleteModal(false);
        setAddressToDelete(null);
      } catch (error) {
        console.error("Error al eliminar la dirección", error);
      }
    }
  };

  const handleSaveAddress = async () => {
    let addressToValidate: AddressType;

    // Determinar qué dirección validar
    if (addressToEdit) {
      addressToValidate = addressToEdit;
    } else {
      addressToValidate = newAddress;
    }

    // Validar la dirección
    const validationErrors = validateAddressFields(addressToValidate);

    // Establecer errores
    setErrors(validationErrors);

    // Verificar si hay errores
    if (Object.keys(validationErrors).length > 0) {
      return; // Detener si hay errores
    }

    try {
      if (addressToEdit && addressToEditIndex !== null) {
        // Editar dirección existente
        await dispatch(
          editAddressAsync({
            userId,
            index: addressToEditIndex,
            updatedAddress: addressToEdit,
          })
        );
      }

      // Recargar direcciones
      await dispatch(getUserAddressesAsync(userId));

      // Cerrar formulario
      setShowAddressForm(false);
      setAddressToEdit(null);
      setNewAddress({
        street: "",
        number: 0,
        zipCode: "",
        city: "",
        province: "",
      });
    } catch (error) {
      console.error("Error al guardar la dirección", error);
    }
  };

  const handleEdit = (address: AddressType, index: number) => {
    setAddressToEdit(address);
    setAddressToEditIndex(index);
    setShowAddressForm(true);
    // Limpiar errores al abrir el formulario de edición
    setErrors({
      street: "",
      number: "",
      zipCode: "",
      city: "",
      province: "",
    });
  };

  const handleAddressChange = (
    field: keyof AddressType,
    value: string | number
  ) => {
    // Para edición de dirección existente
    if (addressToEdit) {
      const updatedAddress = { ...addressToEdit, [field]: value };
      setAddressToEdit(updatedAddress);

      // Validación en tiempo real para el campo modificado
      const fieldValidation = validateAddressFields(updatedAddress);
      setErrors(prev => ({
        ...prev,
        [field]: fieldValidation[field] || "",
      }));
    }
    // Para nueva dirección
    else {
      const updatedAddress = { ...newAddress, [field]: value };
      setNewAddress(updatedAddress);

      // Validación en tiempo real para el campo modificado
      const fieldValidation = validateAddressFields(updatedAddress);
      setErrors(prev => ({
        ...prev,
        [field]: fieldValidation[field] || "",
      }));
    }
  };

  const handleCancel = () => {
    setModalCanceled(true);
  };

  const closeCancelModal = () => {
    setModalCanceled(false);
  };

  const handleConfirmCancel = () => {
    setShowAddressForm(false);
    setModalCanceled(false);
  };

  const openAddressModal = () => {
    setNewAddress({
      street: "",
      number: 0,
      zipCode: "",
      city: "",
      province: "",
    });
    setShowAddressFormModal(true); // Siempre abrir el modal para agregar nueva dirección
    setErrors({
      street: "",
      number: "",
      zipCode: "",
      city: "",
      province: "",
    });
  };

  if (loading) {
    return <div className="text-center py-4">Cargando direcciones...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  const handleSaveNewAddress = async () => {
    try {
      // Aquí puedes agregar la lógica para guardar la nueva dirección
      // Por ejemplo, crear una nueva acción en tu store para agregar direcciones
      // await dispatch(addNewAddressAsync({ userId, newAddress }));

      // Recargar las direcciones después de guardar
      await dispatch(getUserAddressesAsync(userId));
      setShowAddressFormModal(false);
    } catch (error) {
      console.error("Error al guardar la nueva dirección", error);
    }
  };

  const handleNewAddressChange = (
    field: keyof AddressType,
    value: string | number
  ) => {
    setNewAddress(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {/* Modal para eliminar dirección */}
      <Modal
        isShown={showDeleteModal}
        closeModal={() => setShowDeleteModal(false)}
        element={
          <div className="px-6 py-6 flex flex-col justify-center gap-5 w-[481px] h-[192px]">
            <div className="flex justify-between items-center">
              <p className="text-[1rem] text-expresscash-textos font-poppins">
                ¿Está seguro que desea eliminar esta dirección?
              </p>
              <p
                className="cursor-pointer"
                onClick={() => setShowDeleteModal(false)}
              >
                <IconX />
              </p>
            </div>
            <p className="text-[14px] font-poppins text-expresscash-gray w-[380px]">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-4">
              <button
                onClick={confirmDelete}
                className="bg-expresscash-red w-[109px] h-[38px] rounded-[5px] text-expresscash-white text-[1rem] font-poppins"
              >
                Eliminar
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="border-[1px] border-solid border-expresscash-gray w-[109px] h-[38px] rounded-[5px] text-expresscash-gray text-[1rem] font-poppins"
              >
                Cancelar
              </button>
            </div>
          </div>
        }
      />

      {/* Modal para confirmar cancelación */}
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
              Se descartarán los cambios que hayas realizado.
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

      <Modal
        isShown={showAddressForm || showAddressFormModal}
        closeModal={() => setShowAddressFormModal(false)}
        element={
          <div className="space-y-4 max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center"></div>
            <AddressForm
              address={newAddress}
              onAddressChange={handleNewAddressChange}
              onSave={handleSaveNewAddress}
              onCancel={() => setShowAddressFormModal(false)}
              userFormData={user}
            />
          </div>
        }
      />

      {/* Modal para el formulario de dirección */}
      <Modal
        isShown={showAddressForm}
        closeModal={() => setShowAddressForm(false)}
        element={
          <div className="space-y-4 max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center">
              <p className="cursor-pointer" onClick={handleCancel}>
                <IconX />
              </p>
            </div>
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-10">
              {addressToEdit
                ? `Editar Domicilio ${addressToEditIndex! + 1} de ${user.firstName}`
                : "Agregar Domicilio"}
            </h2>

            {/* Formulario de dirección */}
            <div className="grid grid-cols-2 gap-x-4 ml-10 ">
              <div>
                <label className="block text-sm text-gray-700 mb-0.5 ">
                  Dirección
                </label>
                <input
                  type="text"
                  maxLength={12}
                  autoComplete="street-address"
                  value={addressToEdit?.street || newAddress.street} // Asegúrate de que estés usando el estado correcto
                  onChange={e => handleAddressChange("street", e.target.value)} // Eliminar .trim() para permitir espacios
                  className={`w-[300px] h-[54px] rounded-[5px] border-[1px] border-solid ${errors.street ? "border-red-500" : "border-expresscash-gray"}`}
                  placeholder="Ejemplo: Calle Falsa 123"
                  onFocus={e => {
                    e.target.setAttribute("autocomplete", "off");
                    e.target.removeAttribute("autocomplete");
                  }}
                />
                {errors.street && (
                  <p className="text-red-500 text-xs w-[300px]">
                    {errors.street}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-0.5">
                  Número
                </label>
                <input
                  type="number"
                  maxLength={6}
                  autoComplete="off"
                  value={addressToEdit?.number || newAddress.number}
                  onChange={e =>
                    handleAddressChange("number", Number(e.target.value))
                  }
                  className={`w-[300px] h-[54px] rounded-[5px] border-[1px] border-solid ${errors.number ? "border-red-500" : "border-expresscash-gray"}`}
                  placeholder="Ej: 825"
                />
                {errors.number && (
                  <p className="text-red-500 text-xs w-[300px]">
                    {errors.number}
                  </p>
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
                  autoComplete="off"
                  maxLength={6}
                  value={addressToEdit?.zipCode || newAddress.zipCode}
                  onChange={e => handleAddressChange("zipCode", e.target.value)}
                  className={`w-[300px] h-[54px] rounded-[5px] border-[1px] border-solid ${errors.zipCode ? "border-red-500" : "border-expresscash-gray"}`}
                  placeholder="Ej: X5008"
                />
                {errors.zipCode && (
                  <p className="text-red-500 text-xs w-[300px]">
                    {errors.zipCode}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-0.5">
                  Ciudad
                </label>

                <input
                  type="text"
                  autoComplete="off"
                  value={addressToEdit?.city || newAddress.city}
                  onChange={e => handleAddressChange("city", e.target.value)}
                  className={`w-[300px] h-[54px] rounded-[5px] border-[1px] border-solid ${errors.city ? "border-red-500" : "border-expresscash-gray"}`}
                  placeholder="Ej: San Francisco"
                  maxLength={12} // Limita la longitud del texto a 12 caracteres
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    // Filtramos cualquier carácter que no sea letra o espacio
                    const inputValue = e.currentTarget.value.replace(
                      /[^a-zA-Z\s]/g,
                      ""
                    ); // Elimina números y caracteres especiales
                    // Si la longitud no supera los 12 caracteres, actualizamos el estado
                    if (inputValue.length <= 12) {
                      handleAddressChange("city", inputValue);
                    }
                  }}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs w-[300px]">
                    {errors.city}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-x-4 ml-10">
              <div className="col-span-3">
                <label className="block text-sm text-gray-700 mb-0.5">
                  Provincia
                </label>
                <select
                  value={addressToEdit?.province || newAddress.province}
                  onChange={e =>
                    handleAddressChange("province", e.target.value)
                  }
                  className={`w-[617px] h-[54px] rounded-[5px] border-[1px] border-solid ${errors.province ? "border-red-500" : "border-expresscash-gray"}`}
                  autoComplete="off"
                >
                  <option value="">Selecciona una provincia</option>
                  {provinces.map((province, index) => (
                    <option key={index} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
                {errors.province && (
                  <p className="text-red-500 text-xs">{errors.province}</p>
                )}{" "}
                {/* Validación provincia */}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-10">
              <button
                onClick={handleCancel}
                className="border-[1px] border-solid border-expresscash-gray w-[109px] h-[38px] rounded-[5px] text-expresscash-gray text-[1rem] font-poppins"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveAddress}
                className="bg-expresscash-skyBlue w-[109px] h-[38px] rounded-[5px] text-expresscash-white text-[1rem] font-poppins hover:bg-expresscash-blue hover:transition-colors duration-100"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          </div>
        }
      />

      {/* Lista de direcciones */}
      <div className="space-y-4 max-w-5xl mx-auto p-6 w-[552px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 translate-x-[50px]">
            Direcciones de {user.firstName} {user.lastName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IconX />
          </button>
        </div>

        <button
          onClick={openAddressModal}
          className="flex items-center gap-2 px-4 py-2 bg-expresscash-skyBlue text-white rounded-md hover:bg-blue-600 mb-4 translate-x-[130px]"
        >
          <IconEdit />
          Agregar Dirección
        </button>

        {addresses.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No hay direcciones registradas
          </div>
        ) : (
          addresses.map((address, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4 relative">
              <div className="absolute right-4 top-4 flex gap-2">
                <button onClick={() => handleEdit(address, index)}>
                  <IconEdit />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <IconDelete />
                </button>
              </div>

              <p className="text-smb text-expresscash-skyBlue">
                {" "}
                Domicilio {index + 1}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-gray-500">Dirección</p>
                  <p className="font-medium">
                    {address.street} {address.number}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Código Postal</p>
                  <p className="font-medium">{address.zipCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ciudad</p>
                  <p className="font-medium">{address.city}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Provincia</p>
                  <p className="font-medium">{address.province}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default AllAddress;

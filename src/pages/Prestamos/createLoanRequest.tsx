/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

type FormData = {
  amount: string;
  paymentPlan: string;
  user: string;
  estado_pago: string;
};

const CreateLoanRequestModal = ({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (formData: FormData) => void;
}) => {
  const [formData, setFormData] = useState<FormData>({
    amount: "",
    paymentPlan: "",
    user: "",
    estado_pago: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="p-4 bg-white h-[320px] w-[700px]">
      <h2 className="text-xl font-bold mb-8 mt-[-20px]">
        Nueva Solicitud de Préstamo
      </h2>

      <div className="flex gap-8 ">
        {/* Imagen decorativa */}
        <div className="w-[150px] h-[150px] bg-transparent flex-shrink-2 mt-4">
          <img
            src="/iconDolarFly.png"
            alt="decorativa"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Contenedor de inputs */}
        <div className="flex-grow grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-expresscash-textos block font-poppins font-bold">
              Cuotas
            </label>
            <select
              name="estado_pago"
              value={formData.estado_pago}
              onChange={handleChange}
              className="p-2 w-full border border-expresscash-gray rounded-lg font-poppins"
            >
              <option value="">Seleccione cuotas</option>
              <option value="1cuota">1 cuota</option>
              <option value="3cuotas">3 cuotas</option>
              <option value="5cuotas">5 cuotas</option>
              <option value="9cuotas">9 cuotas</option>
              <option value="12cuotas">12 cuotas</option>
              <option value="18cuotas">18 cuotas</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-expresscash-textos block font-poppins font-bold">
              Monto
            </label>
            <select
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="p-2 w-full border border-expresscash-gray rounded-lg font-poppins"
            >
              <option value="">Seleccione un monto</option>
              <option value="50000">50,000</option>
              <option value="100000">100,000</option>
              <option value="150000">150,000</option>
              <option value="200000">200,000</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-expresscash-textos block font-poppins font-bold mt-[10px]">
              Interes
            </label>
            <select
              name="paymentPlan"
              value={formData.paymentPlan}
              onChange={handleChange}
              className="p-2 w-full border border-expresscash-gray rounded-lg font-poppins"
            >
              <option value="">Seleccione Interes</option>
              <option value="10%">10 porciento</option>
              <option value="13%">13 porciento</option>
              <option value="16%">16 porciento</option>
              <option value="19%">19 porciento</option>
              <option value="25%">25 porciento</option>
              <option value="30%">30 porciento</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-expresscash-textos font-poppins font-bold mt-[10px]">
              Usuario
            </label>
            <select
              name="user"
              value={formData.user}
              onChange={handleChange}
              className="p-2 w-full border border-expresscash-gray rounded-lg font-poppins"
            >
              <option value="">Seleccione un usuario</option>
              <option value="Usuario 1">Usuario 1</option>
              <option value="Usuario 2">Usuario 2</option>
              <option value="Usuario 3">Usuario 3</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-[65px] translate-x-[20px]">
        <button
          onClick={onClose}
          className="bg-gray-300 text-black px-4 py-2 rounded-lg"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="bg-expresscash-skyBlue text-white px-4 py-2 rounded-lg"
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default CreateLoanRequestModal;

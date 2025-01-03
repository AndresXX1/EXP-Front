/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

type FormData = {
  amount: string;
  paymentPlan: string;
  user: string;
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
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="p-4 bg-white h-[400px] w-[500px]">
      <h2 className="text-xl font-bold mb-4">Nueva Solicitud de Préstamo</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Monto</label>
        <select
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="border rounded-lg w-full p-2"
        >
          <option value="">Seleccione un monto</option>
          <option value="50000">50,000</option>
          <option value="100000">100,000</option>
          <option value="150000">150,000</option>
          <option value="200000">200,000</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Plan de Pagos</label>
        <select
          name="paymentPlan"
          value={formData.paymentPlan}
          onChange={handleChange}
          className="border rounded-lg w-full p-2"
        >
          <option value="">Seleccione un plan</option>
          <option value="3 cuotas sin interés">3 cuotas sin interés</option>
          <option value="5 cuotas">5 cuotas</option>
          <option value="12 cuotas">12 cuotas</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Usuario</label>
        <select
          name="user"
          value={formData.user}
          onChange={handleChange}
          className="border rounded-lg w-full p-2"
        >
          <option value="">Seleccione un usuario</option>
          {/* Aquí deberás reemplazar con los usuarios reales */}
          <option value="Usuario 1">Usuario 1</option>
          <option value="Usuario 2">Usuario 2</option>
          <option value="Usuario 3">Usuario 3</option>
        </select>
      </div>

      <div className="flex justify-end gap-4 mt-[80px]">
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

/* eslint-disable @typescript-eslint/no-unused-vars */
import { CreditCard, User } from "lucide-react";

interface LoanDetailsProps {
  loanNumber?: string;
  status?: "al_dia" | "en_mora" | "pagado";
  installments?: {
    paid: number;
    total: number;
  };
  amounts?: {
    paid: number;
    remaining: number;
    total: number;
  };
  payment?: {
    status: string;
    method: string;
    subtotal: number;
    shippingCost: number;
    total: number;
  };
  client: {
    name: string;
    email: string;
    phone: string;
    id: string;
    zip_code: string;
    prestamos: Array<{
      numero: string;
      fecha: string;
      monto: number;
      estado_pago: string;
    }>;
  };
}

export default function LoanDetails({
  loanNumber,
  status,
  installments,
  amounts,
  client,
}: LoanDetailsProps) {
  const hasLoan = client.prestamos.length > 0;

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-6 bg-[white]">
      {/* Header */}
      <div className="flex items-center gap-4">
        {hasLoan && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 font-poppins">
              Préstamo {loanNumber}
            </h1>
            <span className="px-3 py-1 text-sm font-bold font-poppins text-green-700 bg-green-100 rounded-full">
              {status === "al_dia" && "Al día"}
              {status === "en_mora" && "En mora"}
              {status === "pagado" && "Pagado"}
            </span>
          </>
        )}
      </div>

      <div className="grid grid-cols-3 gap-8 w-[1100px]">
        {/* Amount and Installments Section */}
        {hasLoan && (
          <div className="col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-black p-6">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-bold text-gray-900 font-poppins">
                  Monto y cuotas
                </h2>
              </div>
              <hr className="border-t border-gray-300 mb-6" />
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-expresscash-textos font-poppins">
                    Cuotas solicitadas
                  </span>
                  <span className="text-gray-900">{installments?.total}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-expresscash-textos font-poppins">
                    Monto Solicitado
                  </span>
                  <span className="text-gray-900">
                    ${amounts?.total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm"></div>
              </div>
            </div>

            {/* Payment Method Section */}

            <div className="flex gap-4">
              <button className="px-4 py-2 bg-expresscash-skyBlue text-white rounded-md hover:bg-expresscash-green">
                Aprobar Préstamo
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                Denegar Préstamo
              </button>
            </div>
          </div>
        )}

        {/* Client Section */}
        <div className="col-span-1">
          <div className="bg-white rounded-lg border border-black p-6">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-medium text-gray-900 font-poppins">
                Cliente
              </h2>
            </div>
            <hr className="border-t border-gray-300 mb-6" />
            <div className="space-y-4">
              <p className="text-base font-bold text-gray-900 font-poppins underline">
                Codigo postal: {client.zip_code}
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 font-poppins">
                  Email: {client.email}
                </p>
                <p className="text-sm text-gray-600 font-poppins">
                  Telefono: {client.phone}
                </p>
                <p className="text-sm text-gray-600 font-poppins">
                  Cuil: {client.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

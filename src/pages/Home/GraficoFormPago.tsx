/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { method: "Tarjeta", value: 20 },
  { method: "Crédito expresscash", value: 15 },
  { method: "Transferencia", value: 12 },
  { method: "Mercado Pago", value: 10 },
  { method: "Dos tarjetas", value: 5 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "white",
          padding: "5px",
          border: "1px solid #cccccc",
        }}
      >
        <p className="label">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const PaymentMethodsChart: React.FC = () => {
  return (
    <div className="rounded-lg p-4 w-full max-w-3xl mt-[-20px]">
      <div className="flex justify-between items-center mb-[15px] ml-[-20px]">
        <h2 className="text-xl text-gray-700 font-poppins">
          Forma de pago más elegida
        </h2>
      </div>
      <div
        style={{
          width: "130%",
          height: 250,
          marginLeft: "-90px",
          marginBottom: "-20px",
          marginTop: "50px",
        }}
      >
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 40,
              bottom: 20,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e0e0e0"
            />
            <XAxis
              dataKey="method"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              domain={[0, 20]}
              ticks={[0, 5, 10, 15, 20]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              fill="#2D6F7C"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PaymentMethodsChart;

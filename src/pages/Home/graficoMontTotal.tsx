/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  LineChart,
} from "recharts";

const data = [
  { fecha: "Mayo 2/4", monto: 120000 },
  { fecha: "Mayo 3/4", monto: 125000 },
  { fecha: "Mayo 4/4", monto: 135000 },
  { fecha: "Julio 1/4", monto: 165000 },
  { fecha: "Junio 2/4", monto: 165000 },
  { fecha: "Junio 3/4", monto: 165000 },
  { fecha: "Junio 4/4", monto: 165000 },
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
        <p className="label">{`${label} : ${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const PrestamosChart: React.FC = () => {
  return (
    <div className="rounded-lg p-4 w-full max-w-3xl mt-[-20px]">
      <div className="flex justify-between items-center mb-[15px] ml-[-20px]">
        <div className="flex items-center gap-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-500"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
          <h2 className="text-xl font-poppins text-gray-700">
            Monto total prestado
          </h2>
        </div>
        <span className="text-sm font-medium text-green-500 font-poppins">
          +4%
        </span>
      </div>
      <div style={{ width: "120%", height: 250, marginLeft: "-70px" }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e0e0e0"
            />
            <XAxis
              dataKey="fecha"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              domain={[50000, 200000]}
              ticks={[50000, 100000, 150000, 200000]}
              tickFormatter={value => `${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="monto"
              stroke="#2D6F7C"
              strokeWidth={2}
              dot={{ r: 4, fill: "#2D6F7C", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#2D6F7C", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PrestamosChart;

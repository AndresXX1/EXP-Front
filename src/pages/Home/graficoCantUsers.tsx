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
  { fecha: "Mayo 2/4", prestamos: 7 },
  { fecha: "Mayo 3/4", prestamos: 14 },
  { fecha: "Mayo 4/4", prestamos: 10 },
  { fecha: "Julio 1/4", prestamos: 14 },
  { fecha: "Junio 2/4", prestamos: 0 },
  { fecha: "Junio 3/4", prestamos: 0 },
  { fecha: "Junio 4/4", prestamos: 0 },
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

const PrestamosChart: React.FC = () => {
  return (
    <div className=" rounded-lg p-4 w-full max-w-3xl mt-[-20px]">
      <div className="flex justify-between items-center mb-[15px] ml-[-20px]">
        <h2 className="text-xl font-poppins">Cantidad de préstamos</h2>
        <span className="text-sm font-medium text-green-500">+4%</span>
      </div>
      <div
        style={{
          width: "130%",
          height: 250,
          marginLeft: "-80px",
          marginBottom: "-40px",
          marginTop: "40px",
        }}
      >
        <ResponsiveContainer>
          <BarChart
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
              domain={[0, 20]}
              ticks={[0, 5, 10, 15, 20]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="prestamos"
              fill="#2D6F7C"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PrestamosChart;

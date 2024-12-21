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
  {
    name: "Métodos de entrega",
    "Retiro en tienda": 32,
    "Envío a domicilio": 68,
  },
];

const CustomTooltip = ({ active, payload }: any) => {
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
        <p className="label">{`${payload[0].name}: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const DeliveryMethodsChart: React.FC = () => {
  return (
    <div className="rounded-lg p-4 w-full max-w-3xl mt-[-20px]">
      <div className="flex justify-between items-center mb-[15px] ml-[-20px]">
        <h2 className="text-xl font-bold text-gray-700">
          Forma de entrega más elegida
        </h2>
      </div>
      <div
        style={{
          width: "130%",
          height: 80,
          marginLeft: "-100px",
          marginBottom: "-20px",
        }}
      >
        <ResponsiveContainer>
          <BarChart
            layout="vertical"
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barSize={40}
          >
            <CartesianGrid horizontal={false} stroke="#e0e0e0" />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={false}
              domain={[0, 100]}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="Retiro en tienda"
              stackId="a"
              fill="#2D6F7C"
              radius={[4, 0, 0, 4]}
            />
            <Bar
              dataKey="Envío a domicilio"
              stackId="a"
              fill="#7BA7B5"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-6 mt-4 ml-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#2D6F7C]"></div>
          <span className="text-sm text-gray-600">Retiro en tienda</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#87C7C1]"></div>
          <span className="text-sm text-gray-600">Envío a domicilio</span>
        </div>
      </div>
    </div>
  );
};

export default DeliveryMethodsChart;

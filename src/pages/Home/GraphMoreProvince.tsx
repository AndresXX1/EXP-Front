/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";

const data = [
  { name: "AMBA", value: 18 },
  { name: "CABA", value: 14 },
  { name: "Santa Fé", value: 6 },
  { name: "Prov. Buenos Aires", value: 4 },
  { name: "Córdoba", value: 2 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 shadow-sm border border-gray-200 rounded-md">
        <p className="text-sm text-gray-600">{`${label}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function MoreProvinceChart() {
  return (
    <div className="w-full max-w-3xl bg-white rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-6 mt-[-32px]">
        Más préstamos por provincia
      </h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{
              top: 0,
              right: -10,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid
              horizontal={true}
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#666" }}
              domain={[0, 20]}
              ticks={[0, 5, 10, 15, 20]}
            />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#666" }}
              width={60}
              style={{ marginRight: "40px" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              fill="#2D6F7C"
              radius={[0, 4, 4, 0]}
              barSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500 mt-[60px] mb-[-0px]">
        <span>1-5 provincias de 23</span>
        <div className="flex gap-2">
          <button className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

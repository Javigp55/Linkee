'use client'
import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";


export function Visits({visitas}) {


  return (
    <div className="flex-col justify-center items-center">
      <h2 className="text-xl flex justify-center items-center font-semibold mb-4">Analytics</h2>
      
      <div style={{ height: "300px" }}>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={visitas}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#4d6dd4"
          fill="#255eda8b"
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
</div>
  );
};


export function HorizontalBarChart({data}) {
  return (
<div className="space-y-2 p-5 ">
  {data.map((item) => (
    <div key={item.name} className="flex items-center h-8">
      {/* Barra de fondo */}
      <div className="flex-1 relative h-full bg-white dark:bg-neutral-800 rounded-xl overflow-hidden">
        <div
          className="flex items-center h-full bg-blue-400 dark:bg-neutral-600 dark:hover:bg-neutral-500 hover:bg-blue-200 rounded-xl pl-2 gap-2"
          style={{ width: `${(item.count / data[0].count) * 100}%` }}
        >

          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200 whitespace-nowrap ml-3">
            {item.name}
          </span>
        </div>
      </div>

      {/* Número a la derecha */}
      <div className="ml-3 flex items-center h-full">
        <span className="text-sm font-medium">{item.count}</span>
      </div>
    </div>
  ))}
</div>



  );
}

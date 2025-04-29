"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { stats_link } from "../../../../../api/api";
import { Visits, HorizontalBarChart } from "./Stats/Visits";

export default function Stat({ id }) {
  const [Day , setDay] = useState(1)


  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["stats",id, Day],
    queryFn: async () => {
      const res = await stats_link(id, Day);
      return res.data;
    },
    staleTime: 60 * 1000
  });



  if (error) return <div>Error: {error.message}</div>;


  
 

  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[80vh] overflow-y-auto md:h-4/5 w-2/3 md:w-5/6 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-100 dark:border-neutral-700 shadow-2xl"
      >
        {isLoading ? (
          <div>Cargando..</div>
        ) : (

        
        <div className="grid grid-cols-1">
          <div className="inline-flex rounded-md items-center justify-center my-7">
            <button
              onClick={() => {setDay(1)

              }}
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-neutral-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-neutral-600 dark:focus:ring-neutral-500 dark:focus:text-white"
              >
              1D
            </button>
            <button
              type="button"
              onClick={() => {setDay(7)}}
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-r border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-neutral-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-neutral-600 dark:focus:ring-neutral-500 dark:focus:text-white"
              >
              7D
            </button>
            <button
              type="button"
              onClick={() => {setDay(30)}}
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-neutral-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-neutral-600 dark:focus:ring-neutral-500 dark:focus:text-white"
              >
              30D
            </button>
            <button
              type="button"
              onClick={() => {setDay(90)}}
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-neutral-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-neutral-600 dark:focus:ring-neutral-500 dark:focus:text-white"
              >
              90D
            </button>
          </div>
          
          <div className="w-full h-full">
            <Visits visitas={stats["visit"]} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-5">
            <div className="border border-neutral-300 dark:border-neutral-600 rounded-2xl w-full max-h-[60vh] overflow-y-auto">
            <div className='flex justify-center items-center'><h1 className='mt-3 font-medium '>Countries</h1></div>
            <HorizontalBarChart data={stats["country"]} />
            </div>
            <div className="border border-neutral-300 dark:border-neutral-600 rounded-2xl w-full max-h-[60vh] overflow-y-auto">
            <div className='flex justify-center items-center'><h1 className='mt-3 font-medium '>Referer</h1></div>
              <HorizontalBarChart data={stats["referer"]} />
            </div>
            <div className="border border-neutral-300 dark:border-neutral-600 rounded-2xl w-full max-h-[60vh] overflow-y-auto">
            <div className='flex justify-center items-center'><h1 className='mt-3 font-medium '>OS</h1></div>
              <HorizontalBarChart data={stats["os"]} />
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

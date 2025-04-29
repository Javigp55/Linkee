'use client'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { stats } from '../../../../../api/api'
import { Visits, HorizontalBarChart } from "../components/Stats/Visits";


export default function page() {
  const [Day , setDay ] = useState(1)
  const [datos, setDatos] = useState(undefined)

    const  {data: gstats, isLoading , isError } = useQuery({
        queryKey: ["general_stats", Day],
        queryFn: async () => {
          const res = await stats(Day);
          return res.data;

        },
        staleTime: 60 * 1000,
      });
      if (isError) return <div>Error al cargar los datos</div>;

      // useEffect(() => {
      //   if (gstats !== undefined){
      //     setDatos(gstats)
      //   }
      // },[gstats])


  return (
        <div className="flex justify-center items-center w-full h-full">
     <div className="bg-white w-full h-full rounded-2xl border-1 border-neutral-200 dark:bg-neutral-800 dark:border-neutral-600">




    {isLoading  ? ( <div>
      Cargando...
      </div>) :
        (
            <div className="grid grid-cols-1">
              <div className="inline-flex rounded-md items-center justify-center my-7">
                <button
                  onClick={() => {setDay(1)
                    // setChange(true)
                  }}
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-neutral-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-neutral-600 dark:focus:ring-neutral-500 dark:focus:text-white"
                >
                  1D
                </button>
                <button
                  type="button"
                  onClick={() => {setDay(7)
                    // setChange(true)
                  }
                }
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-r border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-neutral-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-neutral-600 dark:focus:ring-neutral-500 dark:focus:text-white"
                >
                  7D
                </button>
                <button
                  type="button"
                  onClick={() => {setDay(30)
                    // setChange(true)
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-neutral-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-neutral-600 dark:focus:ring-neutral-500 dark:focus:text-white"
                >
                  30D
                </button>
                <button
                  type="button"
                  onClick={() => {setDay(90)
                    // setChange(true)
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-neutral-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-neutral-600 dark:focus:ring-neutral-500 dark:focus:text-white"
                >
                  90D
                </button>
              </div>
              <div className="w-full h-full">
                <Visits visitas={gstats['Visits']} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-5">
                <div className="border border-neutral-300 dark:border-neutral-600 rounded-2xl w-full max-h-[60vh] overflow-y-auto">
                  <div className='flex justify-center items-center'><h1 className='mt-3 font-medium '>Countries</h1></div>
                  <HorizontalBarChart data={gstats['Country']} />
                </div>
                <div className="border border-neutral-300  dark:border-neutral-600  rounded-2xl w-full max-h-[60vh] overflow-y-auto">
                <div className='flex justify-center items-center'><h1 className='mt-3 font-medium '>Referer</h1></div>
                  <HorizontalBarChart data={gstats['referer']} />
                </div>
                <div className="border border-neutral-300  dark:border-neutral-600 rounded-2xl w-full max-h-[60vh] overflow-y-auto">
                <div className='flex justify-center items-center'><h1 className='mt-3 font-medium '>OS</h1></div>
                <HorizontalBarChart data={gstats['OS']} />
                </div>
              </div>
            </div>
            )}
          </div>
          </div>

  )
}

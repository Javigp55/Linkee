"use client";
import React, { useEffect, useState } from "react";
import { urls } from "../../../../api/api";
import Links from "./components/Links";
import { Search } from "lucide-react";
import Createlink from "./components/Createlink";
import { useQuery } from '@tanstack/react-query';
import { Link } from "lucide-react";
import Image from "next/image";


export default function DashPage() {
  const [filtered, setFiltered] = useState([])

  const [Opencreate , setOpencreate] = useState(false)
  const Closecreate = (() => {setOpencreate(false)})

  // FETCH DE DATOS
  const { data: enlaces, isLoading, error, refetch } = useQuery({
    queryKey: ['enlaces'],
    queryFn: async () => {
      const res = await urls();
      return res.data;

    },
    staleTime: 60 * 1000,
  });
  const Reload = (()=> {
    refetch();
  })


////FUNCION DEL BUSCADOR
  const handleSearch = e => {
    ////METEMOS LO QUE SE ESCRIBE EN BUSCADOR EN VARIABLE
    const value = e.target.value
    ////SI TENEMOS MENOS DE DOS LISTA NORMAL
    if (value.length < 2){
      setFiltered(enlaces.list)
    }
    ////SI ES MAS DE DOS..
    if (value.length > 2){
      ////SE FILTRA LA LISTA RECIBIDA DEL API
      const filteredValues = enlaces.list.filter(enlace => {
        ////EL ENLACE LE OBLIGAMOS A QUE SEA MINUSCULA, Y LO DLE BUSCADOR TAMBIEN
        const enlaceMinus = enlace.name.toLowerCase()
        const busquedaMinus = value.toLowerCase()
        //// SI NOMBRE ENLACE INCLUYE BUSQUEDA DEVUELVE TRUE  
        if(enlaceMinus.includes(busquedaMinus))
            return true
          else
            return false
          
          })
          ////SE METE LOS TRUE EN FILTERED
          setFiltered(filteredValues)
        }
  }

/////USEEFFECT PARA METER LA LISTA RECIBIDA EN FILTERED CUANDO SE HAYA RECIBIDO, SI NO SE 
///// CONDICIONA DA ERROR
  useEffect(() => {
    if (enlaces?.list) {
      setFiltered(enlaces.list)
      console.log(filtered)
    }
  }, [enlaces])



  return (
    <div className="bg-white w-full h-full rounded-2xl border-1 border-neutral-200 dark:bg-neutral-800 dark:border-neutral-600">
      <div className="mt-10 mb-7 flex justify-center items-center">
        <h1 className="text-3xl font-medium">Links</h1>
      </div>
      <button onClick={()=>{setOpencreate(true)}} className="md:hidden m-5 bg-neutral-900 text-white font-light hover:bg-neutral-800 cursor-pointer px-6 py-2 rounded-lg hover:ring-4 hover:ring-neutral-300 ">
          Create link
        </button>
      {/* DIV CREAR/BUSCAR/LIMITE  */}
      <div className=" flex justify-center item">
        {/* BOTON CREAR  */}
        <button onClick={()=>{setOpencreate(true)}} className="hidden md:block mr-auto ml-5 bg-blue-600 dark:bg-blue-900 text-white font-medium hover:bg-blue-500 dark:hover:bg-blue-800 cursor-pointer px-6 py-2 rounded-lg hover:ring-4 hover:ring-neutral-300 dark:hover:ring-neutral-700 ">
          Create link
        </button>
{/* ABRIR CREAR LINK  */}
        {Opencreate &&(
            <div className='fixed z-50 inset-0 flex justify-center items-center bg-black/30 ' onClick={() => {setOpencreate(false)}}>
            <Createlink Close={Closecreate} Reload={Reload}></Createlink>
            </div>
        )}
         {/* CAJA LIMITE LINKS  */}
        <div className="flex justify-center items-center mr-3 ml-3 md:mr-7 hover:bg-neutral-200 dark:hover:bg-neutral-700  rounded-lg cursor-default">
          <div className="flex justify-center items-center border-1 border-neutral-200 dark:border-neutral-600 rounded-lg py-2 px-5">
            <Link className="w-4 h-4 mr-3"></Link>
            <span>{enlaces?.count ?? 0}/30</span>
          </div>
        </div>
    {/* BUSCADOR  */}
        <div className="relative mr-5">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="w-4 h-4"></Search>
          </div>
          <input
            className="w-full rounded-md hover:rounded-2xl border dark:text-neutral-300 border-neutral-200 dark:border-neutral-600 px-10 text-black outline-none placeholder:text-neutral-400 sm:text-sm transition-all focus:border-neutral-500 focus:ring-4 focus:ring-neutral-200 dark:focus:ring-neutral-600 h-10"
            placeholder="Search..."
            type="text"
            onChange={handleSearch}
          ></input>
        </div>
      </div>
      {/* MAP DE LINKS  */}
      {isLoading ? (
        <div className="flex justify-center items-center mt-20">
          <Image
            src="/cargar.gif" // Ruta relativa desde la carpeta "public"
            alt="loading"
            width={100} 
            height={100}
            className=' w-5'
          />
          </div>
      ):
      (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-10 m-5">
        {filtered.map((enlace) => (
          <Links key={enlace.id} enlace={enlace} Reload={Reload} />
        ))}
      </div>

      )
      }

    </div>
  );
}

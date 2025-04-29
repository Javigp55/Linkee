'use client'
import React, { useEffect, useState } from 'react'
import { CornerDownRight, Copy, Trash2, QrCode } from "lucide-react";
import toast from 'react-hot-toast';
import TempInfo from './TempInfo';


export default function LinksIndex({link , onDelete}) {
  const [Time, setTime] = useState('')
//  FUNCION PARA COPIAR ENLACE
  const serv = process.env.NEXT_PUBLIC_URL;
  const url = `${serv}t/${link.name}`
  const copiar = () => {
    navigator.clipboard.writeText(url)
      .then(() => toast.success("Texto copiado al portapapeles."))
      .catch(err => console.error("Error al copiar:", err));
  };

// USE EFFECTE QUE MUESTRA MINUTOS RESTANTE O EXPIRADO Y SE ACTUALIZA CADA MINUTO
  useEffect(() => {
    const actualizarTiempo = () => {
      const fechaActual = new Date();
      const fechaExpira = new Date(link.expira);

      if (fechaActual > fechaExpira) {
        setTime('Expired');
      } else {
        const diferenciaMs = fechaExpira - fechaActual;
        const diferenciaMin = Math.floor(diferenciaMs / 1000 / 60);
        setTime(`${diferenciaMin} min`);
      }
    };

    // Ejecutar inmediatamente al cargar
    actualizarTiempo();

    // Luego actualizar cada minuto
    const intervalo = setInterval(actualizarTiempo, 60000);

    return () => clearInterval(intervalo); // limpieza al desmontar
  }, [link.expira]);



  ///Open para QR
  const[QR, setQR] = useState(false)

    return (
        <div className="border bg-white/60 dark:bg-neutral-900/60 dark:hover:bg-neutral-700/60 border-neutral-300 hover:bg-neutral-100/60 rounded-lg p-4 max-w-full overflow-hidden">
          <div className="flex flex-col">
            <div className="flex items-center truncate">
              <div className='flex items-center'>
                <span className="font-semibold text-neutral-800 dark:text-neutral-100">/{link.name}</span>
                <Copy onClick={copiar} className='w-4 h-4 ml-1.5 cursor-pointer hover:text-blue-800 duration-300'></Copy>
              </div>
              <div className='ml-auto flex items-center mb-1'>
                <div className='mr-3 bg-neutral-300 dark:bg-neutral-500 border-1 border-neutral-300 rounded-2xl cursor-default'>
                  <span className='py-1 px-2 text-sm font-light'>{Time}</span>
                </div>
                <QrCode onClick={() => {setQR(true)}} className='w-4 h-4 mr-2 cursor-pointer hover:text-neutral-900 duration-300'></QrCode>
                <Trash2 onClick={() => {onDelete(link.id)}} className='w-4 h-4 hover:text-red-600 duration-300 cursor-pointer'></Trash2>

              </div>
            </div>
            <div className='flex items-center '>
            <CornerDownRight className='w-3 h-3 mx-1 shrink-0 font-light' />
            <span className="font-light italic truncate overflow-hidden">{link.url}</span>
            </div>
          </div>

          {QR &&(
              <div className='fixed inset-0 flex justify-center items-center bg-black/30 ' onClick={() => {setQR(false)}}>
              <TempInfo data={link}/>
              </div>
          )}
        </div>
      );
    }

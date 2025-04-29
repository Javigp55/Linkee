'use client'
import React, {useState, useEffect} from 'react'
import { Copy, X } from "lucide-react";
import toast from 'react-hot-toast';
import Link from 'next/link'


export default function TempInfo(props) {

  const [Time, setTime] = useState('')

  const data = props.data
  const serv = process.env.NEXT_PUBLIC_URL;
  const url = `${serv}t/${data.name}`

  const copiar = () => {
    navigator.clipboard.writeText(url)
      .then(() => toast.success("Texto copiado al portapapeles."))
      .catch(err => console.error("Error al copiar:", err));
  };


// USE EFFECTE QUE MUESTRA MINUTOS RESTANTE O EXPIRADO Y SE ACTUALIZA CADA MINUTO
  useEffect(() => {
    const actualizarTiempo = () => {
      const fechaActual = new Date();
      const fechaExpira = new Date(data.expira);

      if (fechaActual > fechaExpira) {
        setTime('Expired');
      } else {
        const diferenciaMs = fechaExpira - fechaActual;
        const diferenciaMin = Math.floor((diferenciaMs / (1000 * 60)) % 60);
        const diferenciaSec = Math.floor((diferenciaMs / 1000) % 60)
        console.log(diferenciaMin+':'+diferenciaSec)
        
        setTime(diferenciaMin+':'+diferenciaSec.toString().padStart(2, '0'));
      }
    };

    // Ejecutar inmediatamente al cargar
    actualizarTiempo();

    // Luego actualizar cada segundo
    const intervalo = setInterval(actualizarTiempo, 1000);

    return () => clearInterval(intervalo); // limpieza al desmontar
  }, [data.expira]);

  console.log(Time)

  return (
    <div className='flex justify-center items-center w-full min-h-screen  backdrop-blur'>
  <div className='bg-white dark:bg-neutral-900 rounded-lg shadow-2xl shadow-black flex-col w-full mx-2 md:w-1/2 md:h-1/2  md:pr-5 md:pb-2 border-2 border-neutral-500 dark:border-1 dark:border-neutral:800'   onClick={(e) => e.stopPropagation()}>
    <div className='flex justify-end mr-2 mt-5'><X onClick={props.Close}className='text-gray-500 hover:text-red-500 cursor-pointer duration-300'/></div>
    
    <div className='grid grid-cols-1 md:grid-cols-2 pt-2 pb-8 pr-2 justify-center items-center'>
      <div className='flex flex-col justify-center items-center '>
      <a href={`data:image/jpeg;base64,${data.qr}`} download="QR.jpg">
      <button className='text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-4 cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-700'>Descargar QR</button>
      </a>
      <img className='w-1/2 shadow shadow-black rounded-lg dark:shadow-white' src={`data:image/jpeg;base64,${data.qr}`} />
      <span className='mt-4 font-bold dark:text-gray-100'>/{data.name}</span>
      </div>

      {/* COMIENZO LADO DERECHO */}
      <div className='flex-col justify-center items-center space-y-3'>
        {/* DIV DE NEW LINK */}
      {/* <div className='flex items-center justify-center'>
        <h1 className='font-medium text-lg'>Your temporary link:</h1>
        </div>  */}
        {/* DIV PARA INPUT Y BOTON COPIAR */}
      <div className='flex mx-4  md:mb-1'>

      <input
        type="text"
        value={url}
        label={url}
        readOnly
        className="border border-gray-300 rounded-2xl w-full p-2 bg-stone-200 text-gray-800 cursor-not-allowed mx-3 dark:bg-neutral-700 dark:text-gray-100"
      />
      <button onClick={copiar}><Copy className='hover:text-blue-600 cursor-pointer text-gray-500 duration-300'/></button>
      </div>
      {/* DIV EXPIRES ON
      <div className='flex justify-center items-center'>
        <span className='font-extralight md:ml-2 text-sm mt-3 dark:text-gray-100'>Expires on:</span>
        
        </div> */}
        {/* DONDE SALEN SEGUNDOS PARA EXPIRAR */}
        <div className='flex justify-center items-center mt-5'> 
          <div className='flex justify-center items-center border-1 w-1/3 border-neutral-400 bg-gray-500/50 dark:border-neutral-600 p-3 rounded-lg'> 
            <span className='text-3xl font-light'>{Time}</span>
          </div>
        </div>
        {/* DIV REDIREC A LOGIN */}
        <div className='flex flex-col justify-center items-center mt-5'> 
          <span className='text-sm'>For permanent and personalized links</span>
          <Link href='/login'>
          <span className='text-sm text-blue-600 cursor-pointer hover:underline'>Start now</span>
          </Link>
          </div>
      </div>
    </div>




  </div>

    </div>
  )
}
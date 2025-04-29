'use client'
import React, { useState } from 'react'
import { Copy, Trash2, Pencil, QrCode, ChartNoAxesColumn, Eye } from "lucide-react";
import { deletelink } from '../../../../../api/api';
import Qrwindow from './Qrwindow';
import Edit from './Edit';
import Stat from './Stat';
import toast from 'react-hot-toast';
import ModalBorrar from './ModalBorrar';



export default function Links({enlace , Reload}) {


  const [OpenQR, setOpenQR] = useState(false)
  const [OpenEdit, setOpenEdit] = useState(false)
  const [OpenStat, setOpenStat] = useState(false)
  const [OpenDelete, setOpenDelete] = useState(false)

  const CloseDelete = () => {
    setOpenDelete(false)
  }
  const CloseEdit = () => {
    setOpenEdit(false)
  }


  const serv = process.env.NEXT_PUBLIC_URL;
  const url = `${serv}${enlace.name}`

  const copiar = () => {
    navigator.clipboard.writeText(url)
      .then(() => toast.success("Texto copiado al portapapeles."))
      .catch(err => console.error("Error al copiar:", err));
  };
// CAMBIAR HORA DE FORMATO
  const isoDate = enlace.created_at;
  const date = new Date(isoDate);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formatted = date.toLocaleDateString("en-Us", options);


//FUNCION DE BORRAR TAREAS
  const Borrar =  async () => {
    try{
      const res = await deletelink(enlace.id);
      Reload()
      toast.success("Link removed succesfully.")
  }catch(error){
    toast.error("An error ocurred.")
  }
  }

  const editar = () =>{
    setOpenEdit(false)
    Reload()
  }




  return (
    <div className='rounded-lg border-1 border-neutral-200 dark:border-neutral-600  p-4 hover:shadow-xl dark:hover:bg-neutral-700 '>
    <div className='flex-col'>
    <div className='flex justify-center items-center'>
      <div className='mr-auto ml-2 font-medium flex items-center'>
      <span className=''>/{enlace.name}</span>
      <Copy onClick={copiar}className='ml-3 w-4 h-4 text-neutral-600 dark:text-neutral-300 cursor-pointer hover:text-blue-700 duration-300'></Copy>
      </div>
      <div className='flex'>
        <QrCode onClick={() => {setOpenQR(true)}}className='text-neutral-500 dark:text-neutral-300 w-4 h-4 mr-2 cursor-pointer hover:text-neutral-800 duration-300'/>
        <ChartNoAxesColumn onClick={() => {setOpenStat(true)}} className='text-neutral-500 dark:text-neutral-300 w-4 h-4 mr-2 cursor-pointer hover:text-blue-700 duration-300'/>
        <Pencil onClick={() => {setOpenEdit(true)}} className='text-neutral-500 dark:text-neutral-300 w-4 h-4 mr-2 cursor-pointer hover:text-orange-400 duration-300'></Pencil>
        <Trash2 onClick={() => {setOpenDelete(true)}} className='text-neutral-500 dark:text-neutral-300 w-4 h-4 cursor-pointer hover:text-red-500 duration-300' />
      </div>
    </div>
    <div><span className='ml-2 italic font-light'>{enlace.url}</span></div>
    <div className='flex'>
    <span className='ml-2 italic font-light'>{formatted}</span>
    <div className='ml-auto flex items-center'>
    <Eye className='mr-2 text-neutral-500 dark:text-neutral-300 w-5 h-5' />
    <span className='font-light text-sm'>{enlace.count}</span>
    </div>
    </div>



    </div>
    {/* VENTANA MODAL DE QR */}
    {OpenQR &&(
      <div className='fixed inset-0 flex justify-center items-center bg-black/30 ' onClick={() => {setOpenQR(false)}}>
        <Qrwindow qr={enlace.qr}></Qrwindow>
      </div>
    )}

    {/* MODAL DE EDITAR */}
    {OpenEdit &&(
      <div className='fixed inset-0 flex justify-center items-center bg-black/30 ' onClick={() => {setOpenEdit(false)}}>
        <Edit Close={CloseEdit} name={enlace.name} url={enlace.url} id={enlace.id} editar={editar}></Edit>
      </div>
    )}
    {/* MODAL DE STATS */}
    {OpenStat &&(
      <div className='fixed inset-0 flex justify-center items-center bg-black/30 ' onClick={() => {setOpenStat(false)}}>
       <Stat id={enlace.id}></Stat>
      </div>
    )}
   {/* MODAL DE BORRAR */}
   {OpenDelete &&(
      <div className='fixed inset-0 flex justify-center items-center bg-black/30 ' onClick={() => {setOpenDelete(false)}}>
       <ModalBorrar Borrar={Borrar} Close={CloseDelete}></ModalBorrar>
      </div>
    )}


    </div>
  )
}

'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { ChartPie, LayoutDashboard, Settings, LogOut, Github } from "lucide-react";
import Image from 'next/image';
import { logout as logoutsession } from '../../../../../api/api';
import { useRouter } from 'next/navigation'
import ToogleMode from '@/app/components/ToogleMode';
import { usePathname } from 'next/navigation'
import { bodoni } from '@/app/components/fonts';



export default function BarComponents() {
   const router = useRouter();
   const pathname = usePathname()
   const [infouser ,setInfouser] = useState([])
   const [load , setLoad] = useState(false)
   ///COMPROBAR EN QUE RUTA ESTAMOS
   const Dash = pathname === '/dashboard'
   const Analyti = pathname === '/dashboard/analytics'
   const Settingsurl = pathname === '/dashboard/settings'
   ////FUNCION LOGOUT
   const logouut = async () => {
      try{
      const res = await logoutsession()
      res
      localStorage.removeItem("user");
      router.push('/login')
   }catch(error){
      console.log(error)
   }
   }

   const boton = () => {
      logouut()
  
   }
   useEffect(() => {
      setInfouser(JSON.parse(localStorage.getItem('user')))
      setLoad(true)
   },[])

  return (
   <div className='min-h-screen flex flex-col'>
    <div className='flex-grow'>
      {/* DIV TITULO Y TOOGLE */}
      <div className='relative flex w-full justify-center items-center h-10 mt-5 mb-5'>
         <h1 className={` text-3xl ${bodoni.className}`}>linkee</h1>
      <div className='absolute right-5'>
      <ToogleMode></ToogleMode></div>
      </div>
<aside id="sidebar" className="">
   <div className="h-full bg-neutral-100 dark:bg-neutral-900">
      {/* DIV EMAIL/LISTA */}
      <div className='flex-col'>
         {/* DIV EMAIL */}
         <div className='flex items-center py-2 justify-center mt-2 mb-10 ml-1  md:ml-0 w-full p-2 rounded-2xl'>
         {load && infouser?.user?.picture ? (
         <img
        src={infouser.user.picture}  // Ruta relativa desde la carpeta "public"
        alt="avatar"
        width={100} 
        height={100}
        className='md:ml-2 w-8  rounded-full'
      />) :
      (<div></div>)}
      <h1 className='ml-3 truncate font-light'>{load && infouser?.user?.email ? (infouser.user.email) : (<div></div>)}</h1>
         </div>
         {/* UL LISTA */}
      <ul className="space-y-2 font-normal text-sm flex flex-col justify-center items-center ">
      <li className={`w-[90%]  rounded-lg ${Dash ? 'bg-blue-100/50 dark:bg-neutral-500/50' : 'bg-transparent'}`}>
            <Link href="/dashboard" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-neutral-300 hover:bg-blue-100/50 dark:hover:bg-neutral-500/50 group">
                <LayoutDashboard className='w-4 h-4'></LayoutDashboard>
               <span className="ms-3">Dashboard</span>
            </Link>
         </li>
         <li className={`w-[90%]  rounded-lg ${Analyti ? 'bg-blue-100/50 dark:bg-neutral-500/50' : 'bg-transparent'}`}>
         <Link href="/dashboard/analytics" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-neutral-300 hover:bg-blue-100/50 dark:hover:bg-neutral-500/50 group">
                <ChartPie className='w-4 h-4'></ChartPie>
               <span className="ms-3">Analytics</span>
            </Link>
         </li>
         <li className={`w-[90%] rounded-lg ${Settingsurl ? 'bg-blue-100/50 dark:bg-neutral-500/50' : 'bg-transparent'}`}>
         <Link href="/dashboard/settings" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-neutral-300 hover:bg-blue-100/50 dark:hover:bg-neutral-500/50 group">
                <Settings className='w-4 h-4'></Settings>
               <span className="ms-3">Settings</span>
            </Link>
         </li>

      </ul>
      </div>
   </div>
</aside>

    </div>
    {/* DIV DE LOGOUT */}
    <div className='flex justify-center'>
    <div onClick={() => {boton()}} className='flex justify-center text-sm items-center mb-3 cursor-pointer hover:text-red-500 duration-300'>
    <LogOut className='w-4 h-4'/>
    <span className="ms-3 font-medium">Logout</span>
    </div>
    </div>
    {/* DIV BORDE Y GITHUB */}
    <div className='py-3 border-t border-neutral-300 w-[90%] mx-auto my-2 flex justify-center items-center'>
    
    <a href="https://google.com">
                <Github className='w-5 h-5'></Github>
            </a>


    </div>
    </div>
  )
}

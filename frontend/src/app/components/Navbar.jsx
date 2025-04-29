'use client'
import React, { useEffect, useState } from 'react'
import ToogleMode from './ToogleMode'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Link as Chain, ArrowRight} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname()
  const Login = pathname === '/login'
  const [dash, setDash] = useState(false)
  useEffect(() => {
    const Auth = localStorage.getItem('user')
    if (Auth)
      setDash(true)

  },[])


  return (
    <div className='p-3 flex  bg-white dark:bg-neutral-900 items-center'>
      <Link className='ml-3 flex' href='/'>
      <Chain />

      </Link>
    <div  className="flex ml-auto justify-center items-center">
      {dash ? (
                <div className="flex items-center justify-center border-1 px-4 py-2 rounded-lg mr-3 cursor-pointer hover:dark:bg-neutral-600 border-neutral-400 hover:bg-neutral-400/40 dark:border-neutral-600/40 duration-300">
                <Link href='/dashboard'>
                <div className='flex items-center'>
                <span className='text-neutral-800 dark:text-gray-100 text-sm'>Dashboard</span>
                <ArrowRight className='w-4 h-4 ml-2' />
                </div>
                </Link>
                </div>
      )
       : (Login ? (
        <div className="flex items-center justify-center border-1 px-4 py-2 rounded-lg mr-3 cursor-pointer hover:dark:bg-neutral-600 border-neutral-400 hover:bg-neutral-400/40 dark:border-neutral-600/40 duration-300">
      <div className='flex items-center'>
      <span className='text-neutral-800 dark:text-gray-100 text-sm'>Start Now</span>
      <ArrowRight className='w-4 h-4 ml-2' />
      </div>
      </div>      ):(
        <div className="flex items-center justify-center border-1 px-4 py-2 rounded-lg mr-3 cursor-pointer hover:dark:bg-neutral-600 border-neutral-400 hover:bg-neutral-400/40 dark:border-neutral-600/40 duration-300">
      <Link href='/login'>
      <div className='flex items-center'>
      <span className='text-neutral-800 dark:text-gray-100 text-sm'>Start Now</span>
      <ArrowRight className='w-4 h-4 ml-2' />
      </div>
      </Link>
      </div>
    ))}

      <ToogleMode></ToogleMode>
      
      </div>
    </div>
  )
}

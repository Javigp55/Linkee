'use client'
import React,{useEffect, useState} from 'react'
import { Mail ,Lock } from "lucide-react";
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { singup } from '../../../../api/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';



export default function RegisterPage() {
  const router = useRouter()

  const { register, handleSubmit,formState: {errors}} = useForm()

  const send = handleSubmit(async data => {
    
      try{
        const res = await singup(data)
        toast.success(res.data.message)  
        router.push('/login')
      }catch(error){
        if(error.response.data.username)
          toast.error("Username already exist.")
        else
          toast.error("An error ocurred. Try again later.")
      }
        
    })  



  return (

<div className='flex justify-center items-center'>
    
<form className='mt-20 border-1 border-neutral-500 bg-white  dark:border-neutral-800 dark:bg-neutral-900 w-4/5 md:w-1/3 rounded-4xl p-8'>    
<div className='flex justify-center items-center mb-8'><h1 className='text-neutral-900 dark:text-white text-2xl font-medium'>Create account</h1></div>
<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>

<div className="relative mb-6">
  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
    <Mail className='w-4 h-4 text-gray-500 dark:text-gray-400'></Mail>
  </div>
  <input type="text" id="input-1" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-neutral-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="your@email.com"
  {...register("username", {required: true})}
  />
</div>
<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
<div className="relative mb-2">
  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
    <Lock className='w-4 h-4 text-gray-500 dark:text-gray-400'></Lock>
  </div>
  <input type="text" id="input-2" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-neutral-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="*******"
  {...register("password", {required: true})}
  />
    
</div>
<div className='flex justify-center items-center'>
    <button onClick={send} className='mt-5 cursor-pointer text-gray-50 py-3 px-5 rounded-lg font-medium bg-blue-700 hover:bg-blue-800'>Sing up</button></div>
    <div className='flex justify-center font-light text-sm mt-5'>

    <span className='mr-2'>¿Have you already account? </span><Link className='text-blue-700 cursor-pointer'href='/login'>Log in</Link>
      </div>
  </form>
  </div>
  )
}


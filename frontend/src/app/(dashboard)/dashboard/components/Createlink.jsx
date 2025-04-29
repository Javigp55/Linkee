'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { createlink } from '../../../../../api/api'
import toast from 'react-hot-toast'
import { X} from "lucide-react";



export default function Createlink({Close, Reload}) {
    const  { register, handleSubmit } = useForm()

    const send = handleSubmit(async data => {
        try{
            console.log(data)
            const res = await createlink(data)

            Close();
            toast.success("Link created succesfully.")
            Reload();

        }catch(error){
            console.log(error)
            if (error.response.data.name || error.response.data[0])
                {toast.error("Name is already in use.")}
            else if (error.response.data.url)
                {toast.error("Enter a valid URL https:// or http://")}
            else
                {toast.error("An error ocurred, try again.")}
        }

    })
    

  return (
    <div className='flex justify-center items-center w-full h-full'>
        <div onClick={(e) => e.stopPropagation()} className='bg-white dark:bg-neutral-800 rounded-xl border-1 border-neutral-300 dark:border-neutral-700 shadow-2xl shadow-black' >
        <div className='flex justify-end items-center'>
            <X onClick={() => {Close()}} className='w-5 h-5 mx-5 mt-5 cursor-pointer hover:text-red-500 duration-300'/>
        </div>
        <form className='ml-10 mt-3 mr-10 grid grid-cols-1 justify-center items-center'>
            <div className='flex justify-center items-center mb-5'>
                <h1>Create Link</h1>
            </div>
        <label className='mb-1'>Name</label>
        <input type="text" placeholder="Enter unique name..."
        {...register("name", {required: true})} 
        className='mb-5 md:w-100 bg-white border-1 border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 rounded-lg p-3'/>
        <label className='mb-1'>Url</label>
        <input type="text" placeholder="https://..."
        {...register("url", {required: true})} 
        className='md:w-100 mb-5 bg-white border-1 border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 rounded-lg p-3'/>
        <div className='flex justify-center items-center mt-5 mb-10'>
        <button className=' bg-blue-800 rounded-lg w-1/2 py-2 cursor-pointer hover:bg-blue-600 ' onClick={send}>Send</button>
        </div>
        </form>

        </div>

    </div>
  )
}

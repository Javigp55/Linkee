import React, {useState} from 'react'
import { useForm } from 'react-hook-form'
import { modify } from '../../../../../api/api'
import toast from 'react-hot-toast'
import { X} from "lucide-react";


export default function Edit({name,url, id, editar, Close}) {
    const  { register, handleSubmit } = useForm()
    const send = handleSubmit(async data => {
        try{
            if (data['name'] == "")
                delete data["name"]
            if (data['url'] == "")
                delete data["url"]            
            console.log(data)
            const res = await modify(data , id)
            editar()
            toast.success("Edit completed.")



        }catch(error){
            console.log(error)
            if (error.response.data.name[0])
                toast.error("Name is already in use.")
            else
                toast.error("An error ocurred, try again.")
            
        }

    })
  return (
    <div className='flex w-screen h-screen justify-center items-center'>
        <div onClick={(e) => e.stopPropagation()} className=' bg-white rounded-lg border-1 border-neutral-100 dark:bg-neutral-800 dark:border-neutral-600 shadow-2xl'>
            <div className=''>
                <div className='flex justify-end items-center'>
                    <X onClick={() => {Close()}} className='w-5 h-5 mx-5 mt-3 cursor-pointer hover:text-red-500 duration-300'/>
                </div>
                <div className='flex justify-center items-center'>
                <h1 className='mt-3 font-medium'>EDIT LINK</h1>
                </div>
            <form className='mx-5 mt-5 md:mx-10 grid grid-cols-1 justify-center items-center'>
        <label className='mb-2'>Name</label>
        <input type="text" placeholder={`${name}`}
        {...register("name")}
        className=' bg-white border-1 md:w-100 border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 rounded-lg p-3'/>


        <label className='mb-2'>Url</label>
        <input type="text" placeholder={`${url}`}
        {...register("url")} 
        className='mb-5 bg-white border-1 border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 rounded-lg p-3'/>
        <div className='flex justify-center items-center'>
        <button onClick={send} className='mt-5 mb-10 bg-blue-800 rounded-lg w-1/2 py-2 cursor-pointer hover:bg-blue-600 '>Save</button>
        </div>
        </form>
            </div>
        </div>


    </div>
  )
}

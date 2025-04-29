import React from 'react'
import {  X} from "lucide-react";
import { useForm } from 'react-hook-form';
import { updatepassw } from '../../../../../../api/api';
import toast from 'react-hot-toast';

export default function ModalPassword() {

    const { register, handleSubmit, formState: {errors} } = useForm()

    const enviar = handleSubmit(async data => {
        try{
            const res = await updatepassw(data)
            toast.success(res.data.message)
        }catch(error){
            toast.error(error.response.data.error)
        }
    })
  return (
        <div onClick={(e) => e.stopPropagation()} class="relative bg-white rounded-lg shadow-sm dark:bg-neutral-800 border-1 border-neutral-400 dark:border-neutral-600">
            <div class="flex items-center justify-between p-4 md:p-7 border-b rounded-t dark:border-gray-600 border-gray-200">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Change password
                </h3>
                <button type="button" class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
                    <X class="w-5 h-5 ml-3"/>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <div  class="p-4 md:p-5">
                <form onSubmit={enviar} class="space-y-4">
                    <div>
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Actual password</label>
                        <input type="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-800 dark:border-neutral-600 dark:placeholder-neutral-500 dark:text-white" 
                        {...register("actual", {required: true})}/>
                    </div>
                    <div>
                        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                        <input type="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-800 dark:border-neutral-600 dark:placeholder-neutral-500 dark:text-white" 
                        {...register("new", {required: true})} />
                    </div>
                    <div>
                        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm new Password</label>
                        <input type="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-800 dark:border-neutral-600 dark:placeholder-neutral-500 dark:text-white"
                        {...register("confirm", {required: true})}  />
                    </div>
                    <button type="submit" class="w-full mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Change</button>
                </form>
            </div>
        </div>
  )
}

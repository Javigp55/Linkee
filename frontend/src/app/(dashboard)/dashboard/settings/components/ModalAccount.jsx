import React from 'react'
import { CircleAlert ,X} from "lucide-react";
import { deleteaccount } from '../../../../../../api/api';
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast';


export default function ModalAccount() {
    const router = useRouter();
    const DeleteAccount = async () => {
        try{
            const res = await deleteaccount()
            res
            console.log(res)
            router.push('/')
            toast.success("Your account was deleted sucessfully.")
        }catch(error){
            console.log(error.response.data)
            toast.error("An error ocurred. Try again later")
        }
        
    }
  return (

    <div onClick={(e) => e.stopPropagation()} className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <button type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                <X className="w-5 h-5"></X>
                <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center">

                <CircleAlert className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"/>

                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete your account?</h3>
                <button onClick={DeleteAccount} type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                    Yes, I'm sure
                </button>
                <button type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">No, cancel</button>
            </div>
        </div>
    </div>

  )
}

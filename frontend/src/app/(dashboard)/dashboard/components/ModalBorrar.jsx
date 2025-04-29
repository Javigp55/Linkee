'use client'
import React from 'react'
import { CircleAlert, X} from "lucide-react";


export default function ModalBorrar({Borrar , Close}) {
  return (
    <div onClick={(e) => e.stopPropagation()} className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-neutral-800 border-1 dark:border-neutral-600 border-neutral-200">
            <button onClick={() => {Close()}}type="button" className="absolute top-3 end-2.5 text-gray-400 cursor-pointer bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-neutral-600 dark:hover:text-white">
                <X className="w-5 h-5"></X>
                <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 md:p-5 text-center">

                <CircleAlert className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"/>

                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this link?</h3>
                <button onClick={() => {Borrar()}} type="button" class="text-white cursor-pointer bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                    Yes, I'm sure
                </button>
                <button type="button" onClick={() => {Close()}} className="py-2.5 px-5 ms-3 text-sm cursor-pointer font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-neutral-800 dark:text-gray-400 dark:border-neutral-600 dark:hover:text-white dark:hover:bg-neutral-700">No, cancel</button>
            </div>
        </div>
    </div>
  )
}

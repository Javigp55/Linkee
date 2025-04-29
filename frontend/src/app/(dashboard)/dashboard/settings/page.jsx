'use client'
import React, { useEffect, useState } from 'react'
import ModalLink from './components/ModalLink'
import ModalAccount from './components/ModalAccount'
import ModalPassword from './components/ModalPassword'

export default function page() {
  const [ usuario, setUsuario] = useState([])
  const [ load, setLoad] = useState(false)

  const [OpenLink, setOpenLink] = useState(false)
  const [OpenAccount, setOpenAccount] = useState(false)
  const [OpenPassword, setOpenPassword] = useState(false)

  useEffect(() => {
    const datos = localStorage.getItem('user')
    setUsuario(JSON.parse(datos))
    setLoad(true)
  },[])


  return (
    <div className='flex flex-col'>
      <div className='bg-white border-1 dark:text-neutral-200 border-neutral-200 rounded-2xl dark:bg-neutral-800 dark:border-neutral-700'>
        <div className='m-5'>
        <h1 className='font-bold text-2xl'>Links</h1>
        <h2 className='mt-5 mb-3 font-medium text-lg'>Export all links</h2>
        <button className='bg-white dark:bg-neutral-800 dark:border-neutral-600 dark:hover:bg-neutral-600 dark:text-neutral-200 md:w-1/4 w-full border-1 border-neutral-300 text-black px-8 py-2 rounded-lg hover:bg-neutral-200 duration-300 cursor-pointer'>Export JSON</button>

        <h2 className='mt-5 mb-5 font-medium text-lg'>Delete all links</h2>
        <button onClick={() => {
          setOpenLink(true)
        }} className='bg-red-600 mb-5 md:w-1/4 w-full text-white px-8 py-2 rounded-lg hover:bg-red-400 duration-300 cursor-pointer'>Delete links</button>

        </div>
      </div>
      <div className='bg-white border-1 border-neutral-200 rounded-2xl w-full mt-3 dark:bg-neutral-800 dark:border-neutral-700'>
        <div className='m-5'>
      <h1 className='font-bold text-2xl'>Account</h1>
      <div className='flex flex-col'>
      <label className='mt-5 mb-2 font-medium italic'> Email:
      </label>
      <input
        type="text"
        value={load ? (usuario.user.email) : ('')}
        label='email'
        readOnly
        className="border border-gray-300 rounded-lg w-full md:w-1/3 p-1 bg-stone-200 text-gray-800  dark:bg-neutral-900 dark:text-gray-100 cursor-not-allowed"
      />
    {/* <span className='mt-6 mb-2 font-medium italic'> Password:
      </span>
      <div className='flex items-center'>
      <span className="ml-3 text-xl ">
      ••••••••
      </span>
      <span onClick={() => {setOpenPassword(true)}} className='ml-3 text-blue-500 hover:text-blue-300 duration-300 cursor-pointer'>(change)</span>
      </div> */}

      <h2 className='mt-7 mb-5 font-medium text-lg'>Delete permanently account:</h2>
        <button onClick={() => {
          setOpenAccount(true)
        }} className='bg-red-600 mb-5 md:w-1/4 w-full text-white px-8 py-2 rounded-lg hover:bg-red-400 duration-300 cursor-pointer'>Delete account</button>

        </div>
      </div>
      </div>


      {/* MODAL DELETE LINKS */}
      {OpenLink && (
      <div className='fixed inset-0 flex justify-center items-center bg-black/30 ' onClick={() => {setOpenLink(false)}}>
        <ModalLink></ModalLink>
      </div>
      )}

    {/* MODAL DELETE Account */}
    {OpenAccount && (
      <div className='fixed inset-0 flex justify-center items-center bg-black/30 ' onClick={() => {setOpenAccount(false)}}>
        <ModalAccount></ModalAccount>
      </div>
      )}

    {/* MODAL CHANGE PASSWORD */}
    {OpenPassword && (
      <div className='fixed inset-0 flex justify-center items-center bg-black/30 ' onClick={() => {setOpenPassword(false)}}>
      <ModalPassword></ModalPassword>
      </div>
      )}

    </div>
  )
}

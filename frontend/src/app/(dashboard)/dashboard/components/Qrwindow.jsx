import React from 'react'

export default function Qrwindow({qr}) {
  return (
    <div className='flex justify-center items-center w-full h-full'>
        <div className='w-2/3 h-1/3 md:w-1/3 md:h-2/3 bg-white dark:bg-neutral-800 border-1 dark:border-neutral-600 border-neutral-300 rounded-lg shadow-2xl shadow-black'>
        <div className='flex flex-col justify-center items-center mt-10'>
            <div className='mb-5'><span className='text-lg font-medium'>Your QRcode</span></div>
            
            <img className='w-1/2 shadow shadow-black rounded-lg dark:shadow-white' src={`data:image/jpeg;base64,${qr}`} />
            <a href={`data:image/jpeg;base64,${qr}`} download="QR.jpg">
            <button className='mt-5 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-4 cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-700'>Descargar QR</button>
            </a>
        </div>
        </div>

    </div>
  )
}

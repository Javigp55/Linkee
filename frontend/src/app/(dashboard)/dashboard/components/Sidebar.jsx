import React, { useEffect, useState } from 'react'
import BarComponents from './BarComponents'
import { Menu } from "lucide-react";

export default function Sidebar() {
  const [Open, setOpen] = useState(false)

  return (
    
    <div className=''>
      <div className=''>
    <button onClick={()=>{setOpen(!Open)}} className="md:hidden mt-3 ml-5 inline-flex items-center text-sm text-gray-500 rounded-lg  hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
   
   <Menu className='w-5 h-5'></Menu>
    </button>
  {Open &&(
      <div className='fixed z-20 inset-0 flex bg-black/30 ' onClick={() => {setOpen(false)}}>
        <div className=' w-1/2 rounded-r-3xl bg-neutral-100 dark:bg-neutral-900' onClick={(e) => e.stopPropagation()}>
        <BarComponents className=""/>
        </div>
      </div>
  )}
</div>
<div className='hidden md:block'>
<BarComponents/>

</div>

</div>

  )
}

'use client'
import React , {useState , useEffect} from 'react'
import { Sun , Moon } from "lucide-react";
import { useTheme } from 'next-themes';

export default function ToogleMode() {

    const {theme, setTheme} = useTheme()
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);
  
    if (!mounted) {
      return null
    }
  

  return (
    <div className='flex items-center justify-center rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-600'>
    <button className='p-2 cursor-pointer' onClick={() => {
        setTheme(theme === "light" ? "dark" : "light")
    }}>
        {theme === "light" ?
        (<Sun className='w-5 h-5'></Sun>) :
        (<Moon className='w-5 h-5 text-gray-400'></Moon>)
    }
        </button>
    </div>
  )
}

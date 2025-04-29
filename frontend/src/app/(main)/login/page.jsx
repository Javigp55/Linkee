'use client'
import React, { useEffect, useState , Suspense} from 'react'
import Image from 'next/image';

import { useRouter, useSearchParams } from 'next/navigation';
import { useGoogleLogin  } from '@react-oauth/google';
import { google ,github } from '../../../../api/api';
import toast from 'react-hot-toast';



export default  function LoginPage() {
  const [loading , setLoading] = useState(false)
  const [ code , setCode ] = useState(undefined)
  const router = useRouter()
  useEffect(() => {
    // Obtener parámetros de la URL manualmente
    const params = new URLSearchParams(window.location.search);
    setCode(params.get('code'));

  }, []);
////USEEFFECT PARA LA PETICION DE GOOGLE Y GITHUB
  useEffect(() => {
    if (code)
      {
        setLoading(true)
        /////PETICION DE GOOGLE
        if (code.length > 30)
        {
            const callGoogle = async () => {
              try{
            const data = {"code": code}
            const res = await google(data)
            localStorage.setItem("user", JSON.stringify(res.data))
            router.push('/dashboard')    
          }catch(error){
            setLoading(false)
            if (error.response.data.non_field_errors)
              toast.error("This emails is currently use on Github.")
            else
              toast.error("An error ocurred. Please try again later.")
          }
          }
          callGoogle()
        }
        //////PETICION DE GITHUB
        else {
          const callGithub = async () => {
            try{
              const data = {"code":code}
              const res = await github(data)
              localStorage.setItem("user", JSON.stringify(res.data))
              router.push('/dashboard')  
            }catch(error){
              setLoading(false)
              if (error.response.data.error)
                toast.error("This emails is currently use on Google.")
              else
                toast.error("An error ocurred. Please try again later.")
            }
          }
          callGithub()
        }
      }

  } ,[code])

  /////REDIRECCIONAMIENTO
  const redirGoogle = () => {
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIR_URI}&response_type=code&scope=openid%20email%20profile`

  }
  const redirGithub = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIR_URI}&scope=user:email`


  }
  return (

<div className="relative container m-auto px-6 mt-15">
        <div className="m-auto md:w-1/3">
            <div className="rounded-xl bg-white dark:bg-neutral-900/80 border-1 border-neutral-300 dark:border-neutral-700 shadow-xl">
                <div className="p-8">
                  {/* DIV IMAGEN Y TEXTO */}
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <Image
                        src="/logo.png" // Ruta relativa desde la carpeta "public"
                        alt="avatar"
                        width={100} 
                        height={100}
                        className=' w-15'
                      />
                        <h2 className="mb-5 mt-3 text-2xl text-cyan-900 dark:text-white font-bold">Log in to Linkee
                        </h2>
                    </div>


                  {/* CONDICIONAL PARA CUANDO ESTE CARGANDO */}
                    {loading ? (<div className='flex justify-center items-center mt-10'>
                     {/* IMAGEN CUANDO CARGA  */}
                      <Image
                        src="/cargar.gif" // Ruta relativa desde la carpeta "public"
                        alt="loading"
                        width={100} 
                        height={100}
                        className=' w-5'
                      />
                    </div>) : (
                      // CUANDO NO CARGA MUESTRA LAS BOTONES DE LOGIN
                    <div className="mt-10 grid space-y-4">

                    <button
                      onClick={redirGoogle}
                        className="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 dark:hover:border-neutral-500 focus:bg-blue-50 dark:focus:bg-neutral-500 hover:bg-blue-100 dark:hover:bg-neutral-700 cursor-pointer">
                        <div className="relative flex items-center space-x-4 justify-center">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg"
                                className="absolute left-0 w-5" alt="google logo"></img>
                            <span
                                className="block w-max font-semibold tracking-wide text-gray-700 dark:text-white text-sm transition duration-300 group-hover:text-blue-600 dark:group-hover:text-neutral-200 sm:text-base">Login
                                with Google
                            </span>
                        </div>
                    </button>

                    <button
                      onClick={redirGithub}
                        className="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 dark:hover:border-neutral-500 focus:bg-blue-50 dark:focus:bg-neutral-500 hover:bg-blue-100 dark:hover:bg-neutral-700 cursor-pointer">
                        <div className="relative flex items-center space-x-4 justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                className="absolute left-0 w-5 text-gray-700 dark:text-gray-400" viewBox="0 0 16 16">
                                <path
                                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z">
                                </path>
                            </svg>
                            <span
                                className="block w-max font-semibold tracking-wide text-gray-700 dark:text-white text-sm transition duration-300 group-hover:text-blue-600 dark:group-hover:text-neutral-200 sm:text-base">Login
                                with Github
                            </span>
                        </div>
                    </button>
                </div>

                    )}
                      {/* TERMINOS Y COOKIES */}
                    <div className="mt-14 space-y-4 py-3 text-gray-600 dark:text-gray-400 text-center">
                        <p className="text-xs">By proceeding, you agree to our
                            <a href="/privacy-policy/" className="underline">Terms of Use</a>
                            and confirm you have read our
                            <a href="/privacy-policy/" className="underline">Privacy and Cookie Statement</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

)}



'use client'
import React,{useState ,useEffect} from 'react'
import { useForm } from 'react-hook-form'
import { tempurl } from '../../../api/api'
import  TempInfo  from '../components/TempInfo'
import { CircleArrowRight, CornerDownRight } from "lucide-react";
import LinksIndex from '../components/LinksIndex'
import toast from 'react-hot-toast'
import { bodoni } from '../components/fonts'





export default function Index() {
    const [Open, setOpen] = useState(false)
    const [Data, setData] = useState(null)
    const Close = () => {setOpen(false)}
    const [links, setLinks] = useState([]);
    const [isReady, setIsReady] = useState(false);

    //USEEFFECT PARA COMPROBAR SI HAY LINKS EN LOCAL, Y SI HAY QLOS METE EN UNA CONSTANTE
    useEffect(() => {
      const storedLinks = localStorage.getItem("Links");
      if (storedLinks) {
        setLinks(JSON.parse(storedLinks));
      }
      setIsReady(true);
    }, []);
  
    // CUANDO CAMBIEN LOS DATOS SE GUARDARAN EN LOCALSTORAGE
    useEffect(() => {
      if (isReady) {
        localStorage.setItem("Links", JSON.stringify(links));
      }
    }, [links, isReady]);


    // formulario
    const { register, handleSubmit,formState: {errors}} = useForm()

    // ENVIO CREACION TEMPURL
    const send = handleSubmit(async data => {
      const count = links.length
      console.log(count)
      if (count < 6){
        try{
          const res = await tempurl(data)
          console.log(res)
          setData(res.data)

          const nuevoLink = {
            id: Date.now(), // ID único
            name: res.data.name,
            url : res.data.url,
            expira: res.data.expira,
            qr: res.data.qr,
            creado: res.data.creado,
          };
      
          setLinks([...links, nuevoLink]);
          setOpen(true)
          toast.success("New link created.")



        }catch(error){
          toast.error("Something wrong happened. Try again later.")
        }
    }
    else(
      toast.error("Maximum of 6 temporal links")
    )
        
    })

    const eliminarLink = (id) => {
      const linksNuevos = links.filter(link => link.id !== id);
      setLinks(linksNuevos);
    };

  return (
    <div className=''>
      <section className='flex flex-col justify-center items-center w-full h-full mt-20'>
        <h1 className={`md:text-7xl text-5xl font-medium text-transparent bg-clip-text bg-gradient-to-t from-stone-400 to-black dark:text-stone-50 ${bodoni.className}`}>linkee</h1>
        <h2 className='mt-10 text-xl text-center italic font-light'>Shorten, share, and track your links. Project free and open-source</h2>
        {/* FORMULARIO TEMPURL */}

        <form className='ml-10 mt-15 flex'>
        <input type="text" placeholder="Enter the URL"
        {...register("url", {required: true})} 
        className='bg-stone-50/60 shadow-2xl border-3 border-neutral-600 rounded-4xl md:w-120 py-3 px-7 w-5/6 dark:bg-neutral-900/60 dark:border-1 '/>
        <button onClick={send}><CircleArrowRight size={50}className='ml-3 text-gray-500 hover:text-green-400 cursor-pointer duration-300'/></button>
        </form>


      <div className='w-full max-w-5xl mt-20 mb-10 mx-auto px-4 overflow-x-hidden'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {links.map((link) => (
            <LinksIndex key={link.id} link={link} onDelete={eliminarLink}/>
          ))}
        </div>
      </div>

        {/* MODAL DE CUANDO CREA TEMPLINK */}
        {Open &&(
            <div className='fixed inset-0 flex justify-center items-center bg-black/30' onClick={() => {setOpen(false)}}>
            <TempInfo data={Data} Close={Close} />
            </div>
        )}

      </section>
    </div>
  )
}

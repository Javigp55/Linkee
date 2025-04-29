import tempredir from "../../../../../api/api";
import { redirect } from 'next/navigation'


export default async function Page({ params }) {
    const { id } = await params;
    let url
    try{
        console.log(id)
        const res = await tempredir(id)
        url = res.data.url
        

    }catch(error){
        console.log(error.response)
        return redirect('/error')
    }
    return redirect(url)
  }
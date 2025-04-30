import React from 'react'
import { get_url } from '../../../../api/api'
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';


export default async function Page({params}) {
    const {id} = await params;
    let url;


    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'Unknown';
    const userAgent = headersList.get('user-agent') || 'Unknown';
    const referer = headersList.get('referer') || 'Direct';
  
    function getOS(ua) {
        if (/windows/i.test(ua)) return 'Windows';
        if (/android/i.test(ua)) return 'Android';
        if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
        if (/macintosh/i.test(ua)) return 'macOS';
        if (/linux/i.test(ua)) return 'Linux';
        return 'Unknown';
      }

      const osAgent = getOS(userAgent)


    // Mostrar en consola o enviar a Django
    console.log('🔎 IP:', ip);
    console.log('🔎 User-Agent:', osAgent);
    console.log('🔎 Referer:', referer);

    try{
        console.log(id)
        const res = await get_url(id, 
           { headers: {
                'X-IP': ip,               // Puedes usar cualquier nombre de header
                'X-User-Agent': osAgent, // Agregamos el user-agent
                'X-Referer': referer,     // Referer
              },
            }
        )
        url = res.data.url
        console.log(url)
        
    }catch(error){
        console.log(error.response)
        return redirect('/error')
    }
    return redirect(`${url}`)

}

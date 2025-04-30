import axios from "axios";
import https from 'https';


// const agent = new https.Agent({  
//     rejectUnauthorized: false  // ⚠️ solo para testing
//   });

const URL = process.env.NEXT_PUBLIC_API_URL;
const temp = axios.create({
    withCredentials: true,
    baseURL: URL,
    // httpsAgent: agent,

},
)

const refreshaxios = axios.create({
    withCredentials: true,
    baseURL: URL,
    // httpsAgent: agent,

  })



export const tempurl = async (data) =>{
    const res = await temp.post("temp/" , data)
    return res

}

export default async function tempredir(name) {
    const res = await temp.get("tempinfo/"+name)
    return res

}

// export const login = async (data) =>{
//     const res = await temp.post("login/" , data)
//     return res

// }

export const google = async (data) =>{
    const res = await temp.post("google/" , data)
    return res

}
export const github = async (data) =>{
    const res = await temp.post("github/" , data)
    return res

}
// export const singup = async (data) =>{
//     const res = await temp.post("register/" , data)
//     console.log(res)
//     return res
    

// }

export const urls = async () =>{
    const res = await temp.get("link/")

    return res
    

}

export const createlink = async (data) =>{
    const res = await temp.post("link/" , data)
    console.log(res)
    return res
    

}

export const deletelink = async (linkId) =>{
    const res = await temp.delete("link/"+linkId+'/')
    console.log(res)
    return res
    

}
export const modify = async (data, linkId) =>{
    const res = await temp.patch("link/"+linkId+'/', data)
    console.log(res)
    return res
    

}

export const stats_link = async (id, day) =>{
    const res = await temp.get("get_statistic/"+id+'?day='+day)
    console.log(res)
    return res
    

}

export const get_url = async (id, config={}) =>{
    const res = await temp.get("get_url/"+id, config)
    console.log(res.data)
    return res
   
    

}

export const stats = async (day) =>{
    const res = await temp.get("statistic?day="+day)
    return res
    

}
export const logout = async () =>{
    const res = await temp.post("logout/")
    return res
    

}

export const deleteall = async () =>{
    const res = await temp.post("deleteall/")
    return res
    

}

export const deleteaccount = async () =>{
    const res = await temp.post("deleteaccount/")
    return res

}

export const updatepassw = async (data) =>{
    const res = await temp.post("changepassword/", data)
    return res

}

export const refresh = async () =>{
    const res = await refreshaxios.post("refresh/")
    return res

}



///////////INTERCEPTOR
temp.interceptors.response.use(
    (response) => response,  // Responde normalmente si la solicitud tiene éxito.
    async (error) => {
    

      const config = error.config;
  
      // Si el error es un 401 y no hemos intentado hacer el refresh aún
      if (error.response?.status === 401 && !config._retry) {
        config._retry = true; // Marca que ya intentamos refrescar el token
  
        try {
          // Realizamos el intento de refresh
          const res = await refresh()
 
            console.log(res)
          // Si el refresh es exitoso, reintenta la solicitud original
          return temp(config); 
        } catch (err) {
            console.log("⛔ Refresh falló:", err);
            localStorage.removeItem("user");
            
          // Si el refresh falla, borra las cookies y redirige al login
            window.location.href = '/';
          // Asegúrate de que el flujo se detenga aquí.
          return Promise.reject(err); // No sigue propagando el error
        }
      }
      // Si no es 401 o el refresh ya ha sido intentado, simplemente propaga el error
      return Promise.reject(error);
    }
  );
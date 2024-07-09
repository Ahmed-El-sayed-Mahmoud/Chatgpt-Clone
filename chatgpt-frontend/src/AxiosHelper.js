import axios from "axios";
import { useEffect, useLayoutEffect, useState } from "react";

let api=axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true 
  });



  const AxiosHelper=()=>{
    const [AccessToken,SetAccessToken]=useState(null)
    useEffect(()=>{
        const getNewAccess=async()=>{
            const token = await getNewToken();
            SetAccessToken(token)
        }

        getNewAccess()

        
    },[])

    useLayoutEffect(()=>{
        const interceptors=  ProtectedAxios.interceptors.request.use((conf)=>{
            if(!conf._retry&&AccessToken)
            {
                conf.headers.Authorization=`Bearer ${AccessToken}`
            }
        })
        return () => {
            ProtectedAxios.interceptors.request.eject(interceptors);
          };
    },[AccessToken])


    useLayoutEffect(()=>{
        const RefreshTokenInterceptors= ProtectedAxios.interceptors.response.use(
             (response)=>response,
              async(error)=>{
                const originalRequest = error.conf;
                if(error.status==401&&error.message=="Unauthorized")
                {
                    try{
                        const res= await ProtectedAxios.post('http://localhost:3000/user/refresh-token')
                    SetAccessToken(res.data.AccessToken)
                    originalRequest.headers.Authorization=`Bearer ${res.data.AccessToken}`
                    originalRequest._retry=true;
                    return ProtectedAxios(originalRequest)
                    }
                    catch(err)
                    {
                        console.log(err)
                        SetAccessToken(null)
                    }
                }
                return Promise.reject(error)

                
               
              }
        )
        return ProtectedAxios.interceptors.response.eject(RefreshTokenInterceptors)
    })
  }
  export { ProtectedAxios, AxiosHelper };
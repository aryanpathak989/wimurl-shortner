import apiClient from './apiClient';


export const createLink = async (payload)=>{
  const {data:response} = await apiClient.post("/url/create", payload)
  return response
}

export const fetchAllLinks = async (page)=>{
    const {data:response} = await apiClient.get(`/dashboard/list?page=${page}`)
    return response
}

export const fetchUrlData = async (payload) =>{
    const {data:response} = await apiClient.get("/dashboard/url-details",{
        params:payload
    })
    return response.data
}

export const getLinkClickPerformance = async (payload) =>{

    const {data:response} = await apiClient.get("/link/getLinkClickPerformance",{
        params:payload
    })
    return response
    
}


export const getLinkDeviceBreakDown = async (payload) =>{

    const {data:response} = await apiClient.get("/link/getLinkDeviceBreakDown",{
        params:payload
    })
    return response
    
}

export const getLinkReferencePerformance = async (payload) =>{

    const {data:response} = await apiClient.get("/link/getLinkReferencePerformance",{
        params:payload
    })
    return response
    
}

export const getLinkClicksByCountry = async (payload) =>{

    const {data:response} = await apiClient.get("/link/getLinkClicksByCountry",{
        params:payload
    })
    return response
    
}


export const checkCustomBackHalfAvailable = async (payload)=>{
        const {data:response} = await apiClient.get("/link/checkCustomBackHalfAvailable",{
        params:payload
    })
    return response
}


// '@/api/linkData.ts'
export async function updateUrlData({ urlId, payload }) {
  // adjust endpoint to your backend route if different
    const {data:response} = apiClient.post("/url/update",{urlId,actualUrl:payload.actualUrl,expiryDate:payload.expiryDate,title:payload.title})
    return response

}


import apiClient from './apiClient';

export const fetchUserUsage = async (page)=>{
    const {data:response} = await apiClient.get(`/user/usage`)
    return response
}


export const logout = async ()=>{
    const {data} = await apiClient.get("/user/logout")
        localStorage.removeItem("isAuthenicated")
        localStorage.removeItem("firstName")
        localStorage.removeItem("lastName")
    return data
}

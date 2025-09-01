import apiClient from './apiClient';

export const fetchOverviewData = async (filter)=>{
    const {data:response} = await apiClient.get("/dashboard/overview",{
        params:filter
    })
    return response.data
}
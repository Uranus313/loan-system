import APIClient from "../connections/APIClient";
import { useQuery } from "@tanstack/react-query";
function useGetBanks(){
    const apiClient = new APIClient('user/banks');
    
    return useQuery({
        queryKey : ['bank'],
        queryFn : () => {
            return apiClient.getWithToken();
        },
        staleTime: 30 * 60 * 1000,
        retry: 3
    })
}
export default useGetBanks;
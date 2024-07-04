import APIClient from "../connections/APIClient";
import { useQuery } from "@tanstack/react-query";
function useGetLoans(){
    const apiClient = new APIClient('user/loans');
    
    return useQuery({
        queryKey : ['loan'],
        queryFn : () => {
            return apiClient.getWithToken();
        },
        staleTime: 30 * 60 * 1000,
        retry: 3
    })
}
export default useGetLoans;
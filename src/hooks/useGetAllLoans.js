import APIClient from "../connections/APIClient";
import { useQuery } from "@tanstack/react-query";
function useGetAllLoans(){
    const apiClient = new APIClient('admin/userLoans');
    
    return useQuery({
        queryKey : ['loanList'],
        queryFn : () => {
            return apiClient.getWithToken();
        },
        staleTime: 30 * 1000,
        retry: 3
    })
}
export default useGetAllLoans;
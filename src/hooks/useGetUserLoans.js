import APIClient from "../connections/APIClient";
import { useQuery } from "@tanstack/react-query";
function useGetUserLoans(user_id){
    const apiClient = new APIClient('admin/userLoans/' + user_id);
    
    return useQuery({
        queryKey : [`userLoans${user_id}`],
        queryFn : () => {
            return apiClient.getWithToken();
        },
        staleTime: 30 * 1000,
        retry: 3
    })
}
export default useGetUserLoans;
import APIClient from "../connections/APIClient";
import { useQuery } from "@tanstack/react-query";
function useGetUsers(){
    const apiClient = new APIClient('admin/users');
    
    return useQuery({
        queryKey : ['userList'],
        queryFn : () => {
            return apiClient.getWithToken();
        },
        staleTime: 30 * 60 * 1000,
        retry: 3
    })
}
export default useGetUsers;
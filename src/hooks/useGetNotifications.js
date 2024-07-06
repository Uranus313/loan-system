import APIClient from "../connections/APIClient";
import { useQuery } from "@tanstack/react-query";
function useGetNotifications(){
    const apiClient = new APIClient('user/notifications');
    
    return useQuery({
        queryKey : ['notification'],
        queryFn : () => {
            return apiClient.getWithToken();
        },
        staleTime: 30 * 60 * 1000,
        retry: 3
    })
}
export default useGetNotifications;
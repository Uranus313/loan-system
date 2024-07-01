import APIClient from "../connections/APIClient";
import { useQuery } from "@tanstack/react-query";
function useCheckToken(){
    const apiClient = new APIClient('user/');

    return useQuery({
        queryKey : ['user'],
        queryFn : () => {
            return apiClient.getToken();
        }
    })
}
export default useCheckToken;
import APIClient from "../connections/APIClient";
import { useQuery } from "@tanstack/react-query";
function useLogin(username,password){
    const apiClient = new APIClient('user/login');
    const formData = new FormData();
    formData.append('username',username);
    formData.append('password',password);
    return useQuery({
        queryKey : ['user'],
        queryFn : () => apiClient.post(formData,null)
    })
}
export default useLogin;
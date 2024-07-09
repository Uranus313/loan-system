import APIClient from "../connections/APIClient";
import { useQuery } from "@tanstack/react-query";
function useGetDebtLoan(debt_id){
    const apiClient = new APIClient('user/debts/' + debt_id);
    
    return useQuery({
        queryKey : [`debtLoan${debt_id}`],
        queryFn : () => {
            return apiClient.getWithToken();
        },
        staleTime: 30 * 60 * 1000,
        retry: 3,
        enabled: false,
        refetchOnWindowFocus : false
    })
}
export default useGetDebtLoan;
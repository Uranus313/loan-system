import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { Button } from "react-bootstrap";
import APIClient from "../connections/APIClient";

function AddBank(){
    const nameRef = useRef();
    const apiClient = new APIClient('/user/banks'); 
    const addBank = useMutation({
        mutationFn: (debt) => {  
            console.log(debt);
            return apiClient.putWithToken(debt)},
        onSuccess: (res ) => {
            console.log(res.data);
            for (let i = 0;i<loans.length; i++){
                let loan = loans[i];
                if (loan.loan_id == res.data.loan_id){
                    console.log(loan.debtNumber == loan.paidDebtNumber+1)
                    console.log(loan)
                    if(loan.debtNumber == loan.paidDebtNumber+1){
                        setSelectedLoan(0);
                    }
                    break;
                }
            }
            queryClient.invalidateQueries(["loan"]);

            // navigate("/");
        },
        onError: (error) =>{
            console.log(error)
            console.log(error.response?.data.detail)
        }
    });

    return(
        <form action="" onSubmit={(event) => handleSubmit(event)}>
            <p>bank</p>
            <input type="text" ref={nameRef} placeholder="bank name"  />
            <Button type="submit">Submit</Button>
        </form>
    )
    
}
export default AddBank;
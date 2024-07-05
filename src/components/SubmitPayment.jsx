import Loading from "./Loading";
import useGetLoans from "../hooks/useGetLoans";
import { useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "react-bootstrap";
import APIClient from "../connections/APIClient";
import { useMutation } from "@tanstack/react-query";

function SubmitPayment(){
    let {data: loans,error : fetchError,isLoading} = useGetLoans();
    let [selectedLoan, setSelectedLoan]= useState(0);
    let dateRef = useRef('');
    // let today = ;
    // console.log(new Date().toISOString().split("T")[0]);
    
    const apiClient = new APIClient('user/debts');
    const submitPaidDebt = useMutation({
        mutationFn: (debt) => apiClient.putWithToken(debt),
        onSuccess: (debt) =>{
            queryClient.invalidateQueries(["loan"]);
            console.log(debt);
            // navigate("/");
        },
        onError: (error) =>{
            console.log(error)
            console.log(error.response?.data.detail)
        }
    });
    function handleSubmit(event){
        event.preventDefault();
        if(dateRef.current.value == ''){
            toast('pls enter a date');
        }else if(selectedLoan == 0){
            toast("pls select a loan");
            console.log("a")
        }
        submitPaidDebt({loan_id: selectedLoan,paidDate : dateRef.current.value});
    }
    return (
        <>
        {isLoading? <Loading /> : loans.length==0 ? <p>you have no loans</p> : <div>

                <form className={'d-flex flex-column align-items-center bg-gradient'} action="post" onSubmit={(event) => handleSubmit(event)}>
                <ToastContainer />

                    <div className={'d-grid p-4 rounded-3 bg-secondary-subtle'}>

                            <p>please select a loan</p>
                        <label className={'fw-bold me-3 '} htmlFor="loanSelector">Choose a Bank:</label>
                        <select name="loanSelector" id="loanSelector" onChange={(event) => {
                            if (event.target.value != "no Loan"){
                                setSelectedLoan(event.target.value.loan_id);
                            }else{
                                setSelectedLoan(0);
                            }
                        }}>
                            <option value="no Loan">Select</option>
                            { loans?.map((item,index) => item.paidDate? <option  value={item} key={index}>{item?.bankType == "default"? item.bank?.name : item.customBank?.name} : {item.amount} : {item.startDate}</option>: null)}
                        </select>
                        <div className={'d-flex justify-content-between'}>
                            <p className={'fw-bold me-3 '}>Pay Date :</p>
                            <input className={'input-button rounded-1'} type="date" ref={dateRef} defaultValue={ new Date().toISOString().split("T")[0]}/>
                        </div>
                        <Button type="submit">Submit</Button>
                    </div>
                

                </form>
                

            
        </div> }
        </>
    );
}
export default SubmitPayment;
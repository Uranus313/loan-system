import Loading from "./Loading";
import useGetLoans from "../hooks/useGetLoans";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "react-bootstrap";
import APIClient from "../connections/APIClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import '../component styles/SubmitPayment.css'



function SubmitPayment(){
    let {data: loans,error : fetchError,isLoading} = useGetLoans();
    let [selectedLoan, setSelectedLoan]= useState(0);
    let dateRef = useRef('');
    // let today = ;
    // console.log(new Date().toISOString().split("T")[0]);
    let location = useLocation();
    let locState = location.state;

    // console.log('ooooo',locState);
    const apiClient = new APIClient('user/debts');
    const queryClient = useQueryClient();
    const submitPaidDebt = useMutation({
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
    useEffect(() => {
        if(locState){
            setSelectedLoan(locState.loan_id);
        }
    },[]);
    function handleSubmit(event){
        event.preventDefault();
        if(dateRef.current.value == ''){
            toast('pls enter a date');
            return;
        }else if(selectedLoan == 0){
            toast("pls select a loan");
            return;
        }
        submitPaidDebt.mutate({loan_id: selectedLoan,paidDate : dateRef.current.value});
    }
    return (
        <>
        {isLoading? <Loading /> : loans.length==0 ? <p>you have no loans</p> : <div>

                <form className={'d-flex flex-column align-items-center'} action="post" onSubmit={(event) => handleSubmit(event)}>
                <ToastContainer />

                    <div className={'d-grid p-4 rounded-3 submit-box'}>

                            <p>PLEASE SELECT A LOAN </p>
                        <label className={'fw-bold me-3'} htmlFor="loanSelector">Choose a Bank:</label>
                        <select name="loanSelector" id="loanSelector" defaultValue={locState?.loan_id? locState?.loan_id : null} onChange={(event) => {
                            if (event.target.value != "no Loan"){
                                setSelectedLoan(event.target.value);
                            }else{
                                setSelectedLoan(0);
                            }
                        }}>
                            <option value="no Loan" >Select</option>
                            { loans?.map((item,index) => item.debtNumber != item.paidDebtNumber? <option value={item.loan_id} key={index}>{item?.bankType == "default"? item.bank?.name : item.customBank?.name} : {item.amount} : {item.startDate}</option>: null)}
                        </select>
                        {(selectedLoan != 0) && loans.map( (loan,index) => {
                            if(loan.loan_id == selectedLoan) {
                                return <div key={index} className={'d-flex justify-content-between'}>
                                    <p className={'fw-bold me-3 '}>amount</p>
                                    <p>{loan.debts[0].amount}</p>
                                    </div>
                                    ;
                             }
                            }) }
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
import Loading from "./Loading";
import useGetLoans from "../hooks/useGetLoans";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Button, Form } from "react-bootstrap";
import APIClient from "../connections/APIClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

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
        {isLoading ? (
          <Loading />
        ) : loans.length === 0 ? (
          <p className="text-primary">You have no loans</p>
        ) : (
            <Form
              className="col-10 col-md-6 col-lg-5 d-flex flex-column p-5 align-items-center bg-light shadow-lg mx-auto"
              action="post"
              onSubmit={(event) => handleSubmit(event)}
            >
              <ToastContainer />
  
                <h4 className="text-center mb-5 text-primary">Select a Loan to Proceed</h4>
                <div className="col-12 d-flex flex-column justify-content-between">
                    <div className="d-flex justify-content-between">
                        <label className="col-5 col-lg-4 fw-bold me-3" htmlFor="loanSelector">Choose a Loan:</label>
                        <div className="w-100">
                            <select
                            className="form-select mb-3"
                            name="loanSelector"
                            id="loanSelector"
                            defaultValue={locState?.loan_id ? locState?.loan_id : "no Loan"}
                            onChange={(event) => {
                                setSelectedLoan(event.target.value !== "no Loan" ? event.target.value : 0);
                            }}
                            >
                            <option value="no Loan">Select</option>
                            {loans?.map((item, index) =>
                                item.debtNumber !== item.paidDebtNumber ? (
                                <option value={item.loan_id} key={index}>
                                  Bank: {item?.bankType === "default" ? item.bank?.name : item.customBank?.name} Amount: {item.amount} : Start Date{item.startDate}
                                </option>
                                ) : null
                            )}
                            </select>
                            {selectedLoan !== 0 &&
                            loans.map((loan, index) =>
                                loan.loan_id == selectedLoan ? (
                                <div key={index} className="d-flex justify-content-between mb-3">
                                    <p className="fw-bold me-3">Amount:</p>
                                    <p>{loan.debts[0].amount}</p>
                                </div>
                                ) : null
                            )}
    
                        </div>
                    </div>
                    <div className="col-12 d-flex justify-content-between mb-5 align-items-center">
                        <p className="col-5 col-lg-4 m-0 fw-bold me-3">Pay Date:</p>
                        <input
                            className="form-control"
                            type="date"
                            ref={dateRef}
                            defaultValue={new Date().toISOString().split("T")[0]}
                        />
                    </div>
                    
                </div>
  

  
                <Button variant="primary" type="submit" className="col-5">Submit</Button>
            </Form>
        )}
      </>
    );
}
export default SubmitPayment;
import { useState,useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import '/src/component styles/SignUp.css'
import APIClient from "../connections/APIClient";
import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import useGetLoans from "../hooks/useGetLoans";
import useGetBanks from "../hooks/useGetBanks";
import Loading from "./Loading";
//unfinished page
function AddLoan(){
    // let banks = [{bank_id : 1,name: "Melli"},{bank_id: 2, name: "Sepah"},{bank_id:3, name: "Pasargad"}]
    let {data: banks,error : fetchError,isLoading} = useGetBanks();
    let [error,setError] = useState(null);

    //if true, an input opens up that you can write your own bank name, it gets true and false based on the fact that you got "custom bank" selected or not
    let [customBankSelected,setCustomBankSelected] = useState(false);
    let [newBankSelected,setNewBankSelected] = useState(false);
    let [selectedBank,setSelectedBank] = useState(1);
    const amountRef = useRef('');
    const interestRef = useRef('');
    const debtCountRef = useRef('');
    const startDateRef = useRef('');
    const noteRef = useRef('');
    const bankSelectorRef = useRef('');
    const customBankNameRef = useRef('');
    const apiClient = new APIClient('user/loans');
    let queryClient = useQueryClient();
    const uploadLoan = useMutation({
        mutationFn: (loan) => apiClient.postWithToken(loan),
        onSuccess: (loan) =>{
            queryClient.invalidateQueries(["loan"]);
            console.log(loan);
            // navigate("/");
        },
        onError: (error) =>{
            console.log(error)
            console.log(error.response?.data.detail)
        }
    });
    


    
    const navigate = useNavigate();
    function handleSubmit(event){
        event.preventDefault(); 


        //checking errors for empty inputs, wrong date and ....
        if(amountRef.current.value.trim() == '' || parseInt(amountRef.current.value.trim()) < 1){
            setError("amount shouldn't be empty or smaller than 1");
        }else if(interestRef.current.value.trim() == '' || parseInt(interestRef.current.value.trim()) < 1){
            setError("interest shouldn't be empty or smaller than 1");
        }else if(debtCountRef.current.value.trim() == '' || parseInt(debtCountRef.current.value.trim()) < 1){
            setError("debt count shouldn't be empty or smaller than 1");
        }else if(startDateRef.current.value.trim() == ''){
            setError("start date shouldn't be empty");
        }else if(customBankNameRef.current.value.trim() == '' &&  customBankSelected ){
            setError("custom bank name shouldn't be empty");
        }else{
            let loan = {};
            if(customBankSelected){
                if(newBankSelected){
                    
                }else{
                    loan = { bank_id : null,customBank_id : selectedBank, bankType:"custom",amount : amountRef.current.value,startDate: startDateRef.current.value,debtNumber: debtCountRef.current.value,note : noteRef.current.value.trim() == ''? null : noteRef.current.value.trim(),interest : interestRef.current.value};
                    uploadLoan.mutate(loan);
                }
            }else{
                loan = { bank_id : selectedBank,customBank_id : null, bankType:"default",amount : amountRef.current.value,startDate: startDateRef.current.value,debtNumber: debtCountRef.current.value,note : noteRef.current.value.trim() == ''? null : noteRef.current.value.trim(),interest : interestRef.current.value};
                uploadLoan.mutate(loan);
            }    
            setError(null);
            // for (bank in banks )
            // if(customBankSelected && )
            // uploadLoan.mutate(loan);

            //if there's no problem, remove the error
            // navigate("/verifyingEmail",{state:{email: emailRef.current.value.trim()}});
            // function to add loan 
        }
    }
    return (
        <>
            {isLoading? <Loading /> : <form className={'d-flex flex-column align-items-center bg-gradient'} action="post" onSubmit={(event) => handleSubmit(event)}>
            <div className={'d-grid p-4 rounded-3 bg-secondary-subtle'}>
                <h4>WELCOME TO OUR WEBSITE</h4>
                <p>Please enter the details to add loan</p>

                {/* if error exists : */}
                {error? <p style={{color : 'rgb(230, 18, 18)'}}>{error}</p> : null }
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>Amount :</p>
                    <input className={'input-button rounded-1'} type="number" ref={amountRef} placeholder="amount" />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>Interest :</p>
                    <input className={'input-button rounded-1'} type="number" ref={interestRef} placeholder="interest" />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>How Many Debts? :</p>
                    <input className={'input-button rounded-1'} type="number" ref={debtCountRef} placeholder="debt number" />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>Start Date :</p>
                    <input className={'input-button rounded-1'} type="date" ref={startDateRef}/>
                </div>
                <div className={'d-flex justify-content-between mb-2'}>
                    <label className={'fw-bold me-3 '} htmlFor="bankSelector">Choose a Bank:</label>
                    <select name="bankSelector" id="bankSelector" ref={bankSelectorRef}>    
                        { banks.banks?.map((item,index) => <option onClick={() => {setCustomBankSelected(false);setNewBankSelected(false);setSelectedBank(item.bank_id)}} value={item.name} key={index}>{item.name}</option>)}
                        <option onClick={() => {setCustomBankSelected(true);setSelectedBank(0);
                            if(banks.customBanks.length==0){setNewBankSelected(true)}
                        }} value="customBank">Custom Bank</option>
                    </select>
                </div>
                <div className={customBankSelected? ' d-flex justify-content-between mb-2' : 'd-none'  }>
                    <label className={'fw-bold me-3 '} htmlFor="customBankSelector">Choose a Bank:</label>
                    <select name="customBankSelector" id="customBankSelector" ref={bankSelectorRef}>    
                        { banks.customBanks?.map((item,index) => <option onClick={() => {setNewBankSelected(false);setSelectedBank(item.bank_id)}} value={item.name} key={index}>{item.name}</option>)}
                        <option onClick={() => {setSelectedBank(0);setNewBankSelected(true)}} value="new bank">New Bank</option>
                    </select>
                </div>
                
                <div className={ newBankSelected? ' d-flex justify-content-between' : 'd-none'  }>
                    <p className={'fw-bold me-3 '}>Custom Bank Name :</p>
                    <input className={'input-button rounded-1'} type="text" ref={customBankNameRef} placeholder="custom bank"/>
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>Note :</p>
                    <input className={'input-button rounded-1'} type="text" ref={noteRef} placeholder="note" />
                </div>
                <button className={'submit-button rounded-1'} type="submit">SUBMIT</button>
            </div>
        </form>}
        </>
        
    )
}
export default AddLoan;



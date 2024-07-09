import { useState,useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import '/src/component styles/SignUp.css'
import APIClient from "../connections/APIClient";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import useGetBanks from "../hooks/useGetBanks";
import { Form, Button} from 'react-bootstrap';
import Loading from "./Loading";
import { ToastContainer,toast } from "react-toastify";
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
    const apiClient2 = new APIClient('user/banks');


    let queryClient = useQueryClient();
    const uploadLoan = useMutation({
        mutationFn: (loan) => apiClient.postWithToken(loan),
        onSuccess: (loan) =>{
            queryClient.invalidateQueries(["loan"]);
            console.log(loan);
            toast("your loan successfully added",{onOpen: () => {setFormFunction(false)}, onClose: () => navigate("/user/panel"), type: 'success',autoClose: 500,pauseOnHover: false});

            // navigate("/");
        },
        onError: (error) =>{
            console.log(error)
            console.log(error.response?.data.detail)
            Array.isArray(error.response?.data.detail)?  error.response?.data.detail.map((item,index) => {toast(item.msg.includes("Value error,")?item.msg.replace("Value error, ",''): capitalizeFirstLetter(item.loc[item.loc.length-1]) + " " + item.msg.substr(item.msg.indexOf(" ")+1),{type: "error"})}) : toast(error.response?.data.detail ,{type: "error"})

        }
    });
    const addCustomBank = useMutation({
        mutationFn: (bank) => apiClient2.postWithToken(bank),
        onSuccess: (bank) =>{
            queryClient.invalidateQueries(["bank"]);
            console.log(bank);

            let loan = { bank_id : null,customBank_id : bank.data.bank_id, bankType:"custom",amount : amountRef.current.value,startDate: startDateRef.current.value,debtNumber: debtCountRef.current.value,note : noteRef.current.value.trim() == ''? null : noteRef.current.value.trim(),interest : interestRef.current.value};
            
            uploadLoan.mutate(loan);
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
            toast("amount shouldn't be empty or smaller than 1",{type: "error"});
        }else if(interestRef.current.value.trim() == '' || parseInt(interestRef.current.value.trim()) < 0){
            toast("interest shouldn't be empty or smaller than 0",{type: "error"});
        }else if(debtCountRef.current.value.trim() == '' || parseInt(debtCountRef.current.value.trim()) < 1){
            toast("debt count shouldn't be empty or smaller than 1",{type: "error"});
        }else if(startDateRef.current.value.trim() == ''){
            toast("start date shouldn't be empty",{type: "error"});
        }else if(customBankNameRef.current.value.trim() == '' &&  newBankSelected ){
            toast("custom bank name shouldn't be empty",{type: "error"});
        }else{
            let loan = {};
            if(customBankSelected){
                if(newBankSelected){
                    addCustomBank.mutate({name:customBankNameRef.current.value.trim()})
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
        {isLoading ? (
          <Loading />
        ) : (
          <Form className="d-flex flex-column align-items-center bg-light p-4 rounded-3 shadow-lg mx-auto my-5" style={{ maxWidth: '600px'}} onSubmit={(event) => handleSubmit(event)}>
            <ToastContainer />
            <h4 className="mb-5 text-primary">Please enter the details to add a loan</h4>
  
            {error && <p style={{ color: 'rgb(230, 18, 18)' }}>{error}</p>}
  
            <Form.Group className="mb-3 w-100 d-flex justify-content-between align-items-center">
              <Form.Label className="col-5 fw-bold m-0">Amount:</Form.Label>
              <Form.Control className="flex-grow-1 bg-dark-subtle" type="number" ref={amountRef} placeholder="Amount" />
            </Form.Group>
  
            <Form.Group className="mb-3 w-100 d-flex justify-content-between align-items-center">
              <Form.Label className="col-5 fw-bold m-0">Interest:</Form.Label>
              <Form.Control className="flex-grow-1 bg-dark-subtle" type="number" ref={interestRef} placeholder="Interest" />
            </Form.Group>
  
            <Form.Group className="mb-3 w-100 d-flex justify-content-between align-items-center">
              <Form.Label className="col-5 fw-bold m-0">How Many Debts?</Form.Label>
              <Form.Control className="flex-grow-1 bg-dark-subtle" type="number" ref={debtCountRef} placeholder="Debt Number" />
            </Form.Group>
  
            <Form.Group className="mb-3 w-100 d-flex justify-content-between align-items-center">
              <Form.Label className="col-5 fw-bold m-0">Start Date:</Form.Label>
              <Form.Control className="flex-grow-1 bg-dark-subtle" type="date" ref={startDateRef} />
            </Form.Group>
  
            <Form.Group className="mb-3 w-100 d-flex justify-content-between align-items-center">
              <Form.Label className="col-5 fw-bold m-0" htmlFor="bankSelector">Choose a Bank:</Form.Label>
              <Form.Select className="bg-dark-subtle" name="bankSelector" id="bankSelector" ref={bankSelectorRef} onChange={(event) => {if(event.target.value == "customBank") {setCustomBankSelected(true);setSelectedBank(0); if(banks.customBanks.length==0){setNewBankSelected(true)}}else{ setCustomBankSelected(false);setNewBankSelected(false);setSelectedBank(event.target.value) }}}>
                {banks.banks?.map((item, index) => <option value={item.bank_id} key={index}>{item.name}</option>)}
                <option value="customBank">Custom Bank</option>
              </Form.Select>
            </Form.Group>
  
            {customBankSelected && (
              <Form.Group className="mb-3 w-100 d-flex justify-content-between align-items-center">
                <Form.Label className="col-5 fw-bold m-0" htmlFor="customBankSelector">Choose a Bank:</Form.Label>
                <Form.Select className="bg-dark-subtle" name="customBankSelector" id="customBankSelector" ref={bankSelectorRef} onChange={(event) => {if(event.target.value == "#new bank#"){ setSelectedBank(0); setNewBankSelected(true); }else{ setNewBankSelected(false); setSelectedBank(event.target.value) }}}>
                  {banks.customBanks?.map((item, index) => <option value={item.bank_id} key={index}>{item.name}</option>)}
                  <option value="#new bank#">New Bank</option>
                </Form.Select>
              </Form.Group>
            )}
  
            {newBankSelected && (
              <Form.Group className="mb-3 w-100 d-flex justify-content-between align-items-center">
                <Form.Label className="col-5 fw-bold m-0">Custom Bank Name:</Form.Label>
                <Form.Control className="flex-grow-1 bg-dark-subtle" type="text" ref={customBankNameRef} placeholder="Custom Bank" />
              </Form.Group>
            )}
  
            <Form.Group className="mb-3 w-100 d-flex justify-content-between align-items-center">
              <Form.Label className="col-5 fw-bold m-0">Note:</Form.Label>
              <Form.Control className="flex-grow-1 bg-dark-subtle" type="text" ref={noteRef} placeholder="Note" />
            </Form.Group>
  
            <Button className="col-5 mt-3" variant="primary" type="submit">SUBMIT</Button>
          </Form>
        )}
      </>
        
    )
}
export default AddLoan;



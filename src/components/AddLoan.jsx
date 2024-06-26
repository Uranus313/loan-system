import { useState,useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import '/src/component styles/SignUp.css'


function AddLoan(){
    let banks = [{id : 1,name: "Melli"},{id: 2, name: "Sepah"},{id:3, name: "Pasargad"}]
    let [error,setError] = useState(null);
    let [customBankSelected,setCustomBankSelected] = useState(false);
    const amountRef = useRef('');
    const interestRef = useRef('');
    const debtCountRef = useRef('');
    const startDateRef = useRef('');
    const endDateRef = useRef('');
    const bankSelectorRef = useRef('');
    const customBankNameRef = useRef('');

    


    
    const navigate = useNavigate();
    function handleSubmit(event){
        event.preventDefault(); 
        if(amountRef.current.value.trim() == '' || parseInt(amountRef.current.value.trim()) < 1){
            setError("amount shouldn't be empty or smaller than 1");
        }else if(interestRef.current.value.trim() == '' || parseInt(interestRef.current.value.trim()) < 1){
            setError("interest shouldn't be empty or smaller than 1");
        }else if(debtCountRef.current.value.trim() == '' || parseInt(debtCountRef.current.value.trim()) < 1){
            setError("debt count shouldn't be empty or smaller than 1");
        }else if(startDateRef.current.value.trim() == ''){
            setError("start date shouldn't be empty");
        }else if(endDateRef.current.value.trim() == '' || endDateRef.current.value.trim() < startDateRef.current.value.trim()){
            setError("end date shouldn't be empty or before current date");
        }else if(customBankNameRef.current.value.trim() == '' &&  customBankSelected ){
            setError("custom bank name shouldn't be empty");
        }else{
            setError(null);
            // navigate("/verifyingEmail",{state:{email: emailRef.current.value.trim()}});
            // function to add loan 
        }
    }
    // useEffect(() => {console.log(customBankSelected)},[customBankSelected])
    return (
        <form className={'d-flex flex-column align-items-center bg-gradient'} action="post" onSubmit={(event) => handleSubmit(event)}>
            <div className={'d-grid p-4 rounded-3 bg-secondary-subtle'}>
                <h4>WELCOME TO OUR WEBSITE</h4>
                <p>Please enter the details to sign up</p>
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
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>End Date :</p>
                    <input className={'input-button rounded-1'} type="date" ref={endDateRef}/>
                </div>
                <div className={'d-flex justify-content-between mb-2'}>
                    <label className={'fw-bold me-3 '} htmlFor="bankSelector">Choose a Bank:</label>
                    <select name="bankSelector" id="bankSelector" ref={bankSelectorRef}>    
                        {banks.map((item,index) => <option onClick={() => setCustomBankSelected(false)} value={item.name} key={index}>{item.name}</option>)}
                        <option onClick={() => setCustomBankSelected(true)} value="customBank">Custom Bank</option>
                    </select>
                </div>
                <div className={ customBankSelected? ' d-flex justify-content-between' : 'd-none justify-content-between'  }>
                    <p className={'fw-bold me-3 '}>Custom Bank Name :</p>
                    <input className={'input-button rounded-1'} type="text" ref={customBankNameRef} placeholder="custom bank"/>
                </div>
                <button className={'submit-button rounded-1'} type="submit">SUBMIT</button>
            </div>
        </form>
    )
}
export default AddLoan;


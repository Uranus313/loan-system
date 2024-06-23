import { useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import '/src/component styles/SignUp.css'


function SignUp(){
    let [error,setError] = useState(null);
    let [passVisibility,setPassVisibility] = useState('password');
    let [passVisibilitySwitchText,setPassVisibilitySwitchText] = useState('show password');
    const usernameRef = useRef('');
    const firstNameRef = useRef('');
    const middleNameRef = useRef('');
    const lastNameRef = useRef('');
    const emailRef = useRef('');
    const IDNumberRef = useRef('');
    const dateOfBirthRef = useRef('');
    const passwordRef = useRef('');
    const repeatPasswordRef = useRef('');
    const navigate = useNavigate();
    function handleSubmit(event){
        event.preventDefault(); 
        // console.log('hello');
        // let namePattern = /^[a-zA-Z\s-]+$/;
        if(usernameRef.current.value.trim() == ''){
            setError("username shouldn't be empty");
        }else if(firstNameRef.current.value.trim() == ''){
            setError("first name shouldn't be empty");
        }else if(lastNameRef.current.value.trim() == ''){
            setError("last name shouldn't be empty");
        }else if(emailRef.current.value.trim() == ''){
            setError("email shouldn't be empty");
        }else if(IDNumberRef.current.value.trim() == ''){
            setError("identification number shouldn't be empty");
        }else if(dateOfBirthRef.current.value.trim() == ''){
            setError("date of birth shouldn't be empty");
        }else if(passwordRef.current.value.trim() == ''){
            setError("password shouldn't be empty");
        }else if(repeatPasswordRef.current.value.trim() == ''){
            setError("repeated password shouldn't be empty");
        }else if(repeatPasswordRef.current.value.trim() != passwordRef.current.value.trim()){
            setError("passwords aren't equal");
        }else{
            setError(null);
            navigate("/verifyingEmail",{state:{email: emailRef.current.value.trim()}});
        }
    }
    return (
        <form className={'d-flex flex-column align-items-center bg-gradient'} action="post" onSubmit={(event) => handleSubmit(event)}>
            <div className={'d-grid p-4 rounded-3 bg-secondary-subtle'}>
                <h4>WELCOME TO OUR WEBSITE</h4>
                <p>Please enter the details to sign up</p>
                {error? <p style={{color : 'rgb(230, 18, 18)'}}>{error}</p> : null }
                <input className={'input-button rounded-1'} type="text" ref={usernameRef} placeholder="username" />
                <input className={'input-button rounded-1'} type="text" ref={firstNameRef} placeholder="first name" />
                <input className={'input-button rounded-1'} type="text" ref={middleNameRef} placeholder="middle name" />
                <input className={'input-button rounded-1'} type="text" ref={lastNameRef} placeholder="last name" />
                <input className={'input-button rounded-1'} type="email" ref={emailRef} placeholder="email" />
                <input className={'input-button rounded-1'} type="number" ref={IDNumberRef} placeholder="ID number" />
                <input className={'input-button rounded-1'} type="date" ref={dateOfBirthRef} placeholder="date of birth" />
                <input className={'input-button rounded-1'} type= {passVisibility} ref={passwordRef} placeholder="password" />
                <input className={'input-button rounded-1'} type={passVisibility} ref={repeatPasswordRef} placeholder="repeat password" />
                <button className={'show-pass-btn rounded-1'} type='button' onClick={passVisibility == "password"? () => {setPassVisibility("text");setPassVisibilitySwitchText('hide password')}: () => {setPassVisibility("password");setPassVisibilitySwitchText('show password')}}>{passVisibilitySwitchText}</button>
                <button className={'submit-button rounded-1'} type="submit">SUBMIT</button>
            </div>

        </form>
    )
}
export default SignUp;


import { useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
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
        <form action="post" onSubmit={(event) => handleSubmit(event)} style={{display: "flex", alignItems:"center", flexDirection:'column',width: "100%", color: "white"}}>
            <h2>fill the form</h2>
            {error? <p style={{color : 'rgb(230, 18, 18)'}}>{error}</p> : null }
            <input type="text" ref={usernameRef} placeholder="username" />
            <input type="text" ref={firstNameRef} placeholder="first name" />
            <input type="text" ref={middleNameRef} placeholder="middle name" />
            <input type="text" ref={lastNameRef} placeholder="last name" />
            <input type="email" ref={emailRef} placeholder="email" />
            <input type="number" ref={IDNumberRef} placeholder="ID number" />
            <input type="date" ref={dateOfBirthRef} placeholder="date of birth" />
            <input type= {passVisibility} ref={passwordRef} placeholder="password" />
            <input type={passVisibility} ref={repeatPasswordRef} placeholder="repeat password" />
            <button type="button" onClick={passVisibility == "password"? () => {setPassVisibility("text");setPassVisibilitySwitchText('hide password')}: () => {setPassVisibility("password");setPassVisibilitySwitchText('show password')}}>{passVisibilitySwitchText}</button>
            <button type="submit" style={{backgroundColor: "orange",border: "none", borderRadius : '5px',padding: '10px 15px', cursor:'pointer'}}>Submit</button>

        </form>
    )
}
export default SignUp;
import { useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
let user = {userID : "hello12", username : "Uranus", firstName : "Mehrbod", middleName : null,lastName : "Hashemi", email: "mehrbodmh82@gmail.com" ,dateOfBirth : "2003-11-23",password: "12345678", IDNumber : "313"}
function SignIn(){
    let [error,setError] = useState(null);
    let [passVisibility,setPassVisibility] = useState('password');
    let [passVisibilitySwitchText,setPassVisibilitySwitchText] = useState('show password');
    const usernameRef = useRef('');
    const passwordRef = useRef('');
    const navigate = useNavigate();
    function handleSubmit(event){
        event.preventDefault(); 
        // console.log('hello');
        // let namePattern = /^[a-zA-Z\s-]+$/;
        if(usernameRef.current.value.trim() == ''){
            setError("pls enter your username or email");
        }else if(passwordRef.current.value.trim() == ''){
            setError("password shouldn't be empty");
        }else{
            setError(null);
            //function to check username password
            navigate("/mainMenu",{state:{user}});
        }
    }
    return (
        <form action="post" onSubmit={(event) => handleSubmit(event)} style={{display: "flex", alignItems:"center", flexDirection:'column',width: "100%", color: "white"}}>
            <h2>fill the form</h2>
            {error? <p style={{color : 'rgb(230, 18, 18)'}}>{error}</p> : null }
            <input type="text" ref={usernameRef} placeholder="username or email" />
            <input type= {passVisibility} ref={passwordRef} placeholder="password" />
            <button type="button" onClick={passVisibility == "password"? () => {setPassVisibility("text");setPassVisibilitySwitchText('hide password')}: () => {setPassVisibility("password");setPassVisibilitySwitchText('show password')}}>{passVisibilitySwitchText}</button>
            <button type="submit" style={{backgroundColor: "orange",border: "none", borderRadius : '5px',padding: '10px 15px', cursor:'pointer'}}>Submit</button>

        </form>
    )
}
export default SignIn;
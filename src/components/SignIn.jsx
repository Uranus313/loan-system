import { useState,useRef, useEffect, useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import { useMutation } from "@tanstack/react-query";
import APIClient from "../connections/APIClient";
// let user = {userID : "hello12", username : "Uranus", firstName : "Mehrbod", middleName : null,lastName : "Hashemi", email: "mehrbodmh82@gmail.com" ,dateOfBirth : "2003-11-23",password: "12345678", IDNumber : "313"}

function SignIn(){
    let [error,setError] = useState(null);
    let [passVisibility,setPassVisibility] = useState('password');
    let [passVisibilitySwitchText,setPassVisibilitySwitchText] = useState('show password');
    const usernameRef = useRef('');
    const passwordRef = useRef('');
    const navigate = useNavigate();
    const apiClient = new APIClient('user/login');
    const context = new useOutletContext();
    const login = useMutation({
        mutationFn: (formData) => apiClient.post(formData,null),
        onSuccess: (savedUser, user) =>{
            console.log(savedUser);
            localStorage.setItem("auth-token",savedUser.headers["auth-token"]);
            //main menu
            context.signIn();
            console.log(savedUser.headers["auth-token"]);
        }
    })
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
            const formData = new FormData();

            formData.append('username',usernameRef.current.value.trim());
            formData.append('password',passwordRef.current.value.trim());
            login.mutate(formData);
            //function to check username password
            console.log(login.data);
            // console.log(login.error.response.data.detail);
            // navigate("/mainMenu",{state:{user}});
        }
    }
    // useEffect(() => {
    //     console.log("effect :",login.data);
    // },[login.data])

    return (
        <form action="post" onSubmit={(event) => handleSubmit(event)} style={{display: "flex", alignItems:"center", flexDirection:'column',width: "100%", color: "white"}}>
            <h2>fill the form</h2>
            {login.error && <p style={{color : 'rgb(230, 18, 18)'}}>{login.error.response?.data.detail}</p> }
            {login.isPending && <p style={{color: "yellow"}}>loading</p>}
            {error? <p style={{color : 'rgb(230, 18, 18)'}}>{error}</p> : null }
            <input type="text" ref={usernameRef} placeholder="username or email" />
            <input type= {passVisibility} ref={passwordRef} placeholder="password" />
            <button type="button" onClick={passVisibility == "password"? () => {setPassVisibility("text");setPassVisibilitySwitchText('hide password')}: () => {setPassVisibility("password");setPassVisibilitySwitchText('show password')}}>{passVisibilitySwitchText}</button>
            <button type="submit" style={{backgroundColor: "orange",border: "none", borderRadius : '5px',padding: '10px 15px', cursor:'pointer'}}>Submit</button>

        </form>
    )
}
export default SignIn;
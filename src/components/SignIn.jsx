import { useState,useRef, useEffect, useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "../connections/APIClient";
import SignInContext from "../contexts/SignInContext";

// change this page so that the errors show up in notifications, for making this you can use the on error element of the useMutation (see the editprofile, it's nearly the same)


function SignIn(){
    let [error,setError] = useState(null);
    let [passVisibility,setPassVisibility] = useState('password');
    let [passVisibilitySwitchText,setPassVisibilitySwitchText] = useState('show password');
    const usernameRef = useRef('');
    const passwordRef = useRef('');
    const navigate = useNavigate();
    const apiClient = new APIClient('user/login');
    const context = useContext(SignInContext);
    let queryClient = useQueryClient();
    const login = useMutation({
        mutationFn: (formData) => apiClient.post(formData,null),
        onSuccess: (savedUser, user) =>{
            console.log(savedUser);
            localStorage.setItem("auth-token",savedUser.headers["auth-token"]);
            queryClient.invalidateQueries(["user"]);
            context.setSignedIn(true);
        }
    })
    function handleSubmit(event){
        // handle this errors with toast notifications too (just like edit profile)
        event.preventDefault(); 
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


    return (
        <form action="post" onSubmit={(event) => handleSubmit(event)} style={{display: "flex", alignItems:"center", flexDirection:'column',width: "100%", color: "white"}}>
            <h2>fill the form</h2>
            {/* you can comment out the following line if the errors are shoing up in notifications  */}
            {login.error && <p style={{color : 'rgb(230, 18, 18)'}}>{login.error.response?.data.detail}</p> }
            {/* use spinner/something else for this loading instead of text */}
            {login.isPending && <p style={{color: "yellow"}}>loading</p>}
            {/* you can comment out the following line if the errors are shoing up in notifications * 2  */}
            {error? <p style={{color : 'rgb(230, 18, 18)'}}>{error}</p> : null }
            <input type="text" ref={usernameRef} placeholder="username or email" />
            <input type= {passVisibility} ref={passwordRef} placeholder="password" />
            <button type="button" onClick={passVisibility == "password"? () => {setPassVisibility("text");setPassVisibilitySwitchText('hide password')}: () => {setPassVisibility("password");setPassVisibilitySwitchText('show password')}}>{passVisibilitySwitchText}</button>
            <button type="submit" style={{backgroundColor: "orange",border: "none", borderRadius : '5px',padding: '10px 15px', cursor:'pointer'}}>Submit</button>

        </form>
    )
}
export default SignIn;
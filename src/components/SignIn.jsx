import { useState,useRef, useEffect, useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "../connections/APIClient";
import SignInContext from "../contexts/SignInContext";
import '/src/component styles/SignIn.css'
import 'bootstrap/dist/css/bootstrap.min.css'


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
            setError("Please enter your Username or Email");
        }else if(passwordRef.current.value.trim() == ''){
            setError("Please enter your Password");
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

        <form className={'d-flex align-items-center flex-column bg-gradient login-form'} action="post" onSubmit={(event) => handleSubmit(event)}>
            <div className={'d-grid p-4 rounded-3 bg-secondary-subtle'}>
                <h5 className={'login-form-header'}>PLEASE FILL THE FORM TO SIGN IN</h5>
                {/* you can comment out the following line if the errors are shoing up in notifications  */}
                {login.error && <p style={{color : 'rgb(230, 18, 18)'}}>{login.error.response?.data.detail}</p> }
                {/* use spinner/something else for this loading instead of text */}
                {login.isPending && <p style={{color: "yellow"}}>loading</p>}
                {/* you can comment out the following line if the errors are shoing up in notifications * 2  */}
                {error? <p style={{color : 'rgb(230, 18, 18)'}}>{error}</p> : null }
                <input className={'input-field rounded-1'} type="text" ref={usernameRef} placeholder="username or email" />
                <input className={'input-field rounded-1'} type= {passVisibility} ref={passwordRef} placeholder="password" />
                <button className={'rounded-1 showpass-btn'} type="button" onClick={passVisibility == "password"? () => {setPassVisibility("text");setPassVisibilitySwitchText('hide password')}: () => {setPassVisibility("password");setPassVisibilitySwitchText('show password')}}>{passVisibilitySwitchText}</button>
                <button className={'rounded-1 submit-btn'} type="submit">Submit</button>
            </div>

        </form>
    )
}
export default SignIn;
import { useState,useRef,useContext } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import '/src/component styles/SignUp.css'
import validateEmail from "../functions/validateEmail";
import APIClient from "../connections/APIClient";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import SignInContext from "../contexts/SignInContext";
import capitalizeFirstLetter from "../functions/capitalizedFirstLetter";


// change this page so that the errors show up in notifications, for making this you can use the on error element of the useMutation (see the editprofile, it's nearly the same)


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
    const apiClient = new APIClient('user');
    const context = useContext(SignInContext);
    let queryClient = useQueryClient();
    const signUp = useMutation({
        mutationFn: (user) => apiClient.post(user,null),
        onSuccess: (savedUser, user) =>{
            console.log(savedUser);
            console.log(user);
            localStorage.setItem("auth-token",savedUser.headers["auth-token"]);
            queryClient.invalidateQueries(["user"]);
            context.setSignedIn(true);
            navigate("/verifyingEmail",{state:{email: emailRef.current.value.trim()}});

        },
        onError: (error) =>{
            console.log(error)
            console.log(error.response?.data.detail)
        }
    });
    function handleSubmit(event){
        event.preventDefault(); 
        // handle this errors with toast notifications too (just like edit profile)

        if(usernameRef.current.value.trim() == ''){
            setError("username shouldn't be empty!");
        }else if(validateEmail(usernameRef.current.value.trim()) == true){
            setError("user name shouldn't be an email!");
        }else if(firstNameRef.current.value.trim() == ''){
            setError("first name shouldn't be empty!");
        }else if(lastNameRef.current.value.trim() == ''){
            setError("last name shouldn't be empty!");
        }else if(emailRef.current.value.trim() == '' || validateEmail(emailRef.current.value.trim())== false){
            setError("email shouldn't be empty or in wrong format!");
        }else if(IDNumberRef.current.value.trim() == ''){
            setError("identification number shouldn't be empty!");
        }else if(dateOfBirthRef.current.value.trim() == ''){
            setError("date of birth shouldn't be empty!");
        }else if(passwordRef.current.value.trim() == ''){
            setError("password shouldn't be empty!");
        }else if(repeatPasswordRef.current.value.trim() == ''){
            setError("repeated password shouldn't be empty!");
        }else if(repeatPasswordRef.current.value.trim() != passwordRef.current.value.trim()){
            setError("passwords aren't equal!");
        }else{
            setError(null);
            signUp.mutate({username: usernameRef.current.value.trim(),firstName : firstNameRef.current.value.trim(), middleName: middleNameRef.current.value.trim(),lastName: lastNameRef.current.value.trim(),dateOfBirth: dateOfBirthRef.current.value.trim(),IDNumber : IDNumberRef.current.value.trim(),email: emailRef.current.value.trim(), password : passwordRef.current.value.trim()});
        }
    }
    return (
        <form className={'d-flex flex-column align-items-center bg-gradient'} action="post" onSubmit={(event) => handleSubmit(event)}>
            <div className={'d-grid p-4 rounded-3 bg-secondary-subtle'}>
                <h4>WELCOME TO OUR WEBSITE</h4>
                <p>Please enter the details to sign up</p>
            {/* you can comment out the two following lines if the errors are showing up in notifications  */}

                {signUp.error && <div style={{color : 'rgb(230, 18, 18)'}}>{Array.isArray(signUp.error.response?.data.detail)?  signUp.error.response?.data.detail.map((item,index) => <p key={index}>{item.msg.includes("Value error,")?item.msg.replace("Value error, ",''): capitalizeFirstLetter(item.loc[item.loc.length-1]) + " " + item.msg.substr(item.msg.indexOf(" ")+1)}</p>) : <p>{signUp.error.response?.data.detail}</p>  }</div> }
                {error? <p className={'error'}>{error}</p> : null }
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>Username :</p>
                    <input className={'input-button rounded-1'} type="text" ref={usernameRef} placeholder="username" />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>First name :</p>
                    <input className={'input-button rounded-1'} type="text" ref={firstNameRef} placeholder="first name" />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>Middle Name :</p>
                    <input className={'input-button rounded-1'} type="text" ref={middleNameRef} placeholder="middle name" />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>Last Name :</p>
                    <input className={'input-button rounded-1'} type="text" ref={lastNameRef} placeholder="last name" />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>Email :</p>
                    <input className={'input-button rounded-1'} type="email" ref={emailRef} placeholder="email" />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>ID Number :</p>
                    <input className={'input-button rounded-1'} type="number" ref={IDNumberRef} placeholder="ID number" />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>Date of Birth :</p>
                    <input className={'input-button rounded-1'} type="date" ref={dateOfBirthRef} placeholder="date of birth" />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>Password :</p>
                    <input className={'input-button rounded-1'} type= {passVisibility} ref={passwordRef} placeholder="password" />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>Repeat Password :</p>
                    <input className={'input-button rounded-1'} type={passVisibility} ref={repeatPasswordRef} placeholder="repeat password" />
                </div>
                <button className={'show-pass-btn rounded-1'} type='button' onClick={passVisibility == "password"? () => {setPassVisibility("text");setPassVisibilitySwitchText('hide password')}: () => {setPassVisibility("password");setPassVisibilitySwitchText('show password')}}>{passVisibilitySwitchText}</button>
                <button className={'submit-button rounded-1'} type="submit">SUBMIT</button>
            </div>

        </form>
    )
}
export default SignUp;


import { useState,useRef, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import '/src/component styles/SignUp.css'
import validateEmail from "../functions/validateEmail";
import APIClient from "../connections/APIClient";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import capitalizeFirstLetter from "../functions/capitalizedFirstLetter";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../component styles/EditProfile.css'



function EditProfile(){
    let [error,setError] = useState(null);
    let [passVisibility,setPassVisibility] = useState('password');
    let [passVisibilitySwitchText,setPassVisibilitySwitchText] = useState('show password');
    let [oldPassInput,setOldPassInput] = useState(false);
    let {user} = useOutletContext();
    // console.log(context);
    console.log(user);
    const usernameRef = useRef('');
    const firstNameRef = useRef('');
    const middleNameRef = useRef('');
    const lastNameRef = useRef('');
    const emailRef = useRef('');
    const IDNumberRef = useRef('');
    const dateOfBirthRef = useRef('');
    const passwordRef = useRef('');
    const repeatPasswordRef = useRef('');
    const oldPasswordRef = useRef('');
    const [formFunction,setFormFunction] = useState(true);
    const navigate = useNavigate();
    const apiClient = new APIClient('user');
    let queryClient = useQueryClient();
    const changeInfo = useMutation({
        mutationFn: (user) => apiClient.putWithToken(user,null),
        onSuccess: (savedUser, user) =>{
            queryClient.invalidateQueries(["user"]);

            //toast makes a notificiation on successfull edits and goes to the main page after it
            toast("your profile successfully updated",{onOpen: () => {setFormFunction(false)}, onClose: () => navigate("/"), type: 'success',autoClose: 1000,pauseOnHover: false});
            
        },
        onError: (error) =>{
            console.log(error.response?.data.detail)

            //showing api errors with notifications using toast
            toast(Array.isArray(error.response?.data.detail)?  error.response?.data.detail.map((item,index) =>  {item.msg.includes("Value error,")?item.msg.replace("Value error, ",''): capitalizeFirstLetter(item.loc[item.loc.length-1]) + " " + item.msg.substr(item.msg.indexOf(" ")+1)}) : error.response?.data.detail ,{type: "error",onClose : ()=> console.log("hi")})
        }
    });
    
    function handleSubmit(event){
        event.preventDefault(); 
        console.log(repeatPasswordRef.current.value.trim() );
        console.log(passwordRef.current.value.trim());

        // checking the inputs and showing errors with notifications
        if(repeatPasswordRef.current.value.trim() != passwordRef.current.value.trim()){
            toast("passwords aren't equal",{type: "error",onClose : ()=> console.log("hi")});
        }else if(validateEmail(usernameRef.current.value.trim()) == true ){
            toast("user name shouldn't be an email",{type: "error",onClose : ()=> console.log("hi")});
        }else if (emailRef.current.value.trim() != '' && validateEmail(emailRef.current.value.trim())== false){
            toast("wrong email format",{type: "error",onClose : ()=> console.log("hi")})
        }else{

            console.log(String(user.dateOfBirth))
            console.log(dateOfBirthRef.current.value.trim())
            console.log(dateOfBirthRef.current.value.trim() == '' || dateOfBirthRef.current.value.trim() == user?.dateOfBirth)
            //api stuff, just skip
            changeInfo.mutate({updated_user : {username: usernameRef.current.value.trim() == ''? null : usernameRef.current.value.trim(),firstName : firstNameRef.current.value.trim() == ''? null : firstNameRef.current.value.trim(), middleName: middleNameRef.current.value.trim() == ''? null : middleNameRef.current.value.trim(),lastName: lastNameRef.current.value.trim() == ''? null : lastNameRef.current.value.trim(),dateOfBirth: (dateOfBirthRef.current.value.trim() == '' || dateOfBirthRef.current.value.trim() == user?.dateOfBirth)? null : dateOfBirthRef.current.value.trim(),IDNumber : IDNumberRef.current.value.trim() == ''? null : IDNumberRef.current.value.trim(),email: emailRef.current.value.trim() == ''? null : emailRef.current.value.trim(), password : passwordRef.current.value.trim() == ''? null : passwordRef.current.value.trim()},password: passwordRef.current.value.trim() == ''? null : oldPasswordRef.current.value.trim()});
        }
    }
    
    return (
        <form className={'d-flex flex-column align-items-center bg-gradient'} action="post" onSubmit={ formFunction? (event) => handleSubmit(event): (event) => {event.preventDefault()}} >
            {/* for using toast you need 2 things, 1_the toast function that accepts a string and an object with configs 2_ toast container that shows where you want your notifications to appear */}
            <ToastContainer />
            <div className={'d-grid p-4 rounded-3 bg-gradient mt-4 mb-4 edit-box'}>
                <h4>Fill Every Field You Want to Change</h4>
                <hr></hr>
                {/* you can comment the following line because we show the errors with toast now */}
                {changeInfo.error && <div style={{color : 'rgb(230, 18, 18)'}}>{Array.isArray(changeInfo.error.response?.data.detail)?  changeInfo.error.response?.data.detail.map((item,index) => <p key={index}>{item.msg.includes("Value error,")?item.msg.replace("Value error, ",''): capitalizeFirstLetter(item.loc[item.loc.length-1]) + " " + item.msg.substr(item.msg.indexOf(" ")+1)}</p>) : <p>{changeInfo.error.response?.data.detail}</p>  }</div> }
                {error? <p style={{color : 'rgb(230, 18, 18)'}}>{error}</p> : null }
                <div className={'d-flex justify-content-between mt-4'}>
                    <p className={'fw-bold me-3'}>New Username :</p>
                    <input className={'input-button rounded-1 edit-input'} type="text" ref={usernameRef} placeholder={user?.username} />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>New First name :</p>
                    <input className={'input-button rounded-1 edit-input'} type="text" ref={firstNameRef} placeholder={user?.firstName} />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>New Middle Name :</p>
                    <input className={'input-button rounded-1 edit-input'} type="text" ref={middleNameRef} placeholder={user?.middleName}  />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>New Last Name :</p>
                    <input className={'input-button rounded-1 edit-input'} type="text" ref={lastNameRef} placeholder={user?.lastName} />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>New ID Number :</p>
                    <input className={'input-button rounded-1 edit-input'} type="number" ref={IDNumberRef} placeholder={user?.IDNumber}  />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>Email :</p>
                    <input className={'input-button rounded-1 edit-input'} type="email" ref={emailRef} placeholder={user?.email} />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>New Date of Birth :</p>
                    <input  className={'input-button rounded-1 edit-input'} type="date" ref={dateOfBirthRef}  defaultValue={user?.dateOfBirth} />
                </div>
                {/* when you write into new password, an input for old password opens up */}
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>New Password :</p>
                    <input className={'input-button rounded-1 edit-input'} type= {passVisibility} ref={passwordRef} placeholder="password" onChange={(event) => {event.target.value== ''? setOldPassInput(false) : setOldPassInput(true)}}/>
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>Repeat New Password :</p>
                    <input className={'input-button rounded-1 edit-input'} type={passVisibility} ref={repeatPasswordRef} placeholder="Repeat password" />
                </div>
                <div className={oldPassInput? 'd-flex justify-content-between' : 'd-none'}>
                    <p className={'fw-bold me-3 '}>Current Password :</p>
                    <input className={'input-button rounded-1 edit-input'} type={passVisibility} ref={oldPasswordRef} placeholder="Current password" />
                </div>
                <button className={'show-pass-btn rounded-1'} type='button' onClick={passVisibility == "password"? () => {setPassVisibility("text");setPassVisibilitySwitchText('hide password')}: () => {setPassVisibility("password");setPassVisibilitySwitchText('show password')}}>{passVisibilitySwitchText}</button>
                <button className={'submit-button rounded-1'} type="submit">SUBMIT</button>
            </div>

        </form>
    )
}
export default EditProfile;


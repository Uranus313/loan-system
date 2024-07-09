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
        <form className='d-flex flex-column align-items-center p-4' action="post" onSubmit={formFunction ? (event) => handleSubmit(event) : (event) => { event.preventDefault(); }}>
        <ToastContainer />
        <div className='d-grid p-4 rounded-3 shadow-lg bg-light' style={{ backgroundColor: '#ffffff', maxWidth: '600px', width: '100%' }}>
          <h4 className='mb-5 text-primary text-center'>Fill Every Field You Want to Change</h4>
          {changeInfo.error && (
            <div style={{ color: 'rgb(230, 18, 18)' }}>
              {Array.isArray(changeInfo.error.response?.data.detail)
                ? changeInfo.error.response?.data.detail.map((item, index) => (
                  <p key={index}>{item.msg.includes("Value error,") ? item.msg.replace("Value error, ", '') : capitalizeFirstLetter(item.loc[item.loc.length - 1]) + " " + item.msg.substr(item.msg.indexOf(" ") + 1)}</p>
                ))
                : <p>{changeInfo.error.response?.data.detail}</p>}
            </div>
          )}
          {error ? <p style={{ color: 'rgb(230, 18, 18)' }}>{error}</p> : null}
  
          {[
            { label: 'New Username', type: 'text', ref: usernameRef, placeholder: user?.username },
            { label: 'New First Name', type: 'text', ref: firstNameRef, placeholder: user?.firstName },
            { label: 'New Middle Name', type: 'text', ref: middleNameRef, placeholder: user?.middleName },
            { label: 'New Last Name', type: 'text', ref: lastNameRef, placeholder: user?.lastName },
            { label: 'New ID Number', type: 'number', ref: IDNumberRef, placeholder: user?.IDNumber },
            { label: 'Email', type: 'email', ref: emailRef, placeholder: user?.email },
            { label: 'New Date of Birth', type: 'date', ref: dateOfBirthRef, placeholder: user?.dateOfBirth }
          ].map((field, idx) => (
            <div key={idx} className='d-flex justify-content-between align-items-center m-2'>
              <p className='col-5 fw-bold text-secondary m-0'>{field.label}:</p>
              <input className='form-control rounded-1 bg-dark-subtle' type={field.type} ref={field.ref} placeholder={field.placeholder} />
            </div>
          ))}
  
          <div className='d-flex justify-content-between align-items-center m-2'>
            <p className='col-5 fw-bold text-secondary'>New Password:</p>
            <input className='form-control rounded-1  bg-dark-subtle' type={passVisibility} ref={passwordRef} placeholder="password" onChange={(event) => { event.target.value === '' ? setOldPassInput(false) : setOldPassInput(true); }} />
          </div>
  
          <div className='d-flex justify-content-between align-items-center m-2'>
            <p className='col-5 fw-bold text-secondary'>Repeat New Password:</p>
            <input className='form-control rounded-1 bg-dark-subtle' type={passVisibility} ref={repeatPasswordRef} placeholder="repeat password" />
          </div>
  
          {oldPassInput && (
            <div className='d-flex justify-content-between align-items-center m-2'>
              <p className='col-5 fw-bold text-secondary'>Current Password:</p>
              <input className='form-control rounded-1 bg-dark-subtle' type={passVisibility} ref={oldPasswordRef} placeholder="Current password" />
            </div>
          )}
  
            <div className="form-check form-switch m-2">
                <input className={'form-check-input '} type="checkBox" id="flexSwitchCheckDefault" onClick={passVisibility == "password"? () => {setPassVisibility("text");setPassVisibilitySwitchText('hide password')}: () => {setPassVisibility("password");setPassVisibilitySwitchText('show password')}} />
                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Show Password</label>
            </div>
  
          <div className='d-flex justify-content-center mt-3'>
            <button className='col-5 btn btn-primary' type="submit">SUBMIT</button>
          </div>
        </div>
      </form>
    )
}
export default EditProfile;


import { useState,useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import '/src/component styles/SignUp.css'
import validateEmail from "../functions/validateEmail";


function EditProfile(){
    let [error,setError] = useState(null);
    let [passVisibility,setPassVisibility] = useState('password');
    let [passVisibilitySwitchText,setPassVisibilitySwitchText] = useState('show password');
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
    const navigate = useNavigate();
    function handleSubmit(event){
        event.preventDefault(); 

        if(repeatPasswordRef.current.value.trim() != passwordRef.current.value.trim()){
            setError("passwords aren't equal");
        }else if(validateEmail(usernameRef.current.value.trim()) == true ){
            setError("user name shouldn't be an email");
        }else if (emailRef.current.value.trim() != '' && validateEmail(emailRef.current.value.trim())== false){
            setError("wrong email format")
        }else{
            //function to change info
            setError(null);
            navigate("/",{state:{email: emailRef.current.value.trim()}});
        }
    }
    return (
        <form className={'d-flex flex-column align-items-center bg-gradient'} action="post" onSubmit={(event) => handleSubmit(event)}>
            <div className={'d-grid p-4 rounded-3 bg-secondary-subtle'}>
                <h4>Fill Every Field You Want to Change</h4>
                {error? <p style={{color : 'rgb(230, 18, 18)'}}>{error}</p> : null }
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>New Username :</p>
                    <input className={'input-button rounded-1'} type="text" ref={usernameRef} placeholder={user?.username} />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>New First name :</p>
                    <input className={'input-button rounded-1'} type="text" ref={firstNameRef} placeholder={user?.firstName} />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>New Middle Name :</p>
                    <input className={'input-button rounded-1'} type="text" ref={middleNameRef} placeholder={user?.middleName}  />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>New Last Name :</p>
                    <input className={'input-button rounded-1'} type="text" ref={lastNameRef} placeholder={user?.lastName} />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>New ID Number :</p>
                    <input className={'input-button rounded-1'} type="number" ref={IDNumberRef} placeholder={user?.IDNumber}  />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>Email :</p>
                    <input className={'input-button rounded-1'} type="email" ref={emailRef} placeholder={user?.email} />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>New Date of Birth :</p>
                    <input  className={'input-button rounded-1'} type="date" ref={dateOfBirthRef}  defaultValue={user?.dateOfBirth} />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>New Password :</p>
                    <input className={'input-button rounded-1'} type= {passVisibility} ref={passwordRef} placeholder="password" />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>Repeat New Password :</p>
                    <input className={'input-button rounded-1'} type={passVisibility} ref={repeatPasswordRef} placeholder="repeat password" />
                </div>
                <button className={'show-pass-btn rounded-1'} type='button' onClick={passVisibility == "password"? () => {setPassVisibility("text");setPassVisibilitySwitchText('hide password')}: () => {setPassVisibility("password");setPassVisibilitySwitchText('show password')}}>{passVisibilitySwitchText}</button>
                <button className={'submit-button rounded-1'} type="submit">SUBMIT</button>
            </div>

        </form>
    )
}
export default EditProfile;


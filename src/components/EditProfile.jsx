import { useState,useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import '/src/component styles/SignUp.css'


function EditProfile(){
    let [error,setError] = useState(null);
    let [passVisibility,setPassVisibility] = useState('password');
    let [passVisibilitySwitchText,setPassVisibilitySwitchText] = useState('show password');
    let user = useOutletContext();
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
                    <p className={'fw-bold me-3 '}>Username :</p>
                    <input className={'input-button rounded-1'} type="text" ref={usernameRef} placeholder={user.username} />
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
                    <p className={'fw-bold me-3 '}>ID Number :</p>
                    <input className={'input-button rounded-1'} type="number" ref={IDNumberRef} placeholder="ID number" />
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>Date of Birth :</p>
                    <input  className={'input-button rounded-1'} type="date" ref={dateOfBirthRef}  defaultValue={user.dateOfBirth} />
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
export default EditProfile;


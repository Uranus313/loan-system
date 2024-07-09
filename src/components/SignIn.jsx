import { useState,useRef, useEffect, useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "../connections/APIClient";
import SignInContext from "../contexts/SignInContext";
import 'bootstrap/dist/css/bootstrap.min.css'
import { toast, ToastContainer } from "react-toastify";
import { Button, Form, Spinner } from 'react-bootstrap';


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
            toast("logged in successFully",{onClose: () => navigate('/user/panel'),autoClose : 1000,pauseOnHover: false});
        }
    });
    
    
    useEffect(() => localStorage.removeItem("auth-token"),[])
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

        <form className="col-10 col-sm-6 col-md-5 col-lg-4 mx-auto d-flex align-items-center flex-column bg-light login-form" action="post" onSubmit={(event) => handleSubmit(event)}>
        <ToastContainer />
        <div className="d-grid p-4 rounded-3 shadow-lg w-100">
          <h5 className="text-center mb-5 text-primary">PLEASE FILL THE FORM TO SIGN IN</h5>
  
          {/* Error Messages */}
          {login.error && <p className="text-danger">{login.error.response?.data.detail}</p>}
          {login.isPending && <Spinner animation="border" variant="warning" />}
          {error && <p className="text-danger">{error}</p>}
  
          {/* Input Fields */}
          <Form.Group className="mb-3">
            <Form.Control type="text" ref={usernameRef} placeholder="Username or Email" className="input-field rounded-1 bg-dark-subtle" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control type={passVisibility} ref={passwordRef} placeholder="Password" className="input-field rounded-1 bg-dark-subtle" />
          </Form.Group>
  
          {/* Show Password Switch */}
          <Form.Check
            type="switch"
            id="passVisibilitySwitch"
            label="Show Password"
            onClick={() => {
              if (passVisibility === "password") {
                setPassVisibility("text");
                setPassVisibilitySwitchText('hide password');
              } else {
                setPassVisibility("password");
                setPassVisibilitySwitchText('show password');
              }
            }}
          />
  
          {/* Submit Button */}
          <Button variant="primary" type="submit" className="col-5 mx-auto mt-3 rounded-1 submit-btn">Submit</Button>
        </div>
      </form>
    )
}
export default SignIn;
import { useLocation } from "react-router-dom";

// this page needs no style for now

function sendEmailVerification(email){
    //backend function
    console.log(email);
}
function VerifyingEmail(){
    let location = useLocation();
    let email = location.state.email;
    
    return(
    <div>
        <h1>email verification</h1>
        <p>pls check your email for a verification link</p>
        <p>if you don't find it, press this button to resend : <button onClick={() => sendEmailVerification(email)}>resend email</button> </p>

    </div>)
}
export default VerifyingEmail;
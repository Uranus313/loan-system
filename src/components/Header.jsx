import { Link } from 'react-router-dom';
import '../component styles/Header.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState } from 'react';

function Header({menuControl,signedIn,isLoading}){

        
    return(
        <>
        <header className={"d-flex justify-content-between text-white align-items-center p-2"}>
            <Link style={{textDecoration: "none"}} className={"navbar-text-logo m-0 text-white"}>LOAN REMINDER</Link>
            <img  className={'navbar-img-logo'} src={'./src/assets/logo.png'}/>
            {/* if you're getting the data from the api, it shows a spinned for loading */}
            {isLoading ? <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>: <div>   
                {/* if you are not loaing, then if the user is signed in it creates the Menu toggle button else it makes Log in and sign up links */}
            {signedIn? <button onClick={menuControl}>menu button</button> : <nav className={'d-flex gap-4'}>
                <Link to={"/signIn"} className={" navbar-text"} >LOG IN</Link>
                <Link to={"/signUp"} className={" navbar-text"} >SIGN UP</Link>
            </nav>}
            </div>}

            
            

            
        </header>
        </>

    )
}
export default Header;



// <header style={{display: "flex", justifyContent: "space-between"}}>
// <img src={'/src/assets/logo.png'} className={'navbar-image'}/>
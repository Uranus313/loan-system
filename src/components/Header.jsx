import { Link, useNavigate } from 'react-router-dom';
import '../component styles/Header.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import UserNavbar from "./Navbar.jsx";
import logo from '../assets/logo.png';
import { Button } from 'react-bootstrap';
import { ToastContainer,toast } from "react-toastify";

function Header({user, logOut, isMenuOpen, setIsMenuOpen,signedIn,isLoading}){
    const navigate = useNavigate();

    return(
        <>
        <header className="row d-flex text-white align-items-center m-0">
            <div className='row-col-12 position-absolute d-flex justify-content-center'>
                <img className='navbar-img-logo d-none d-sm-block' src={logo} alt={'Logo'} />
            </div>    
            <div className='row-col-12 d-flex align-items-center justify-content-between px-4'>
                <div className='col-6 z-1'>
                    <Link style={{textDecoration:"none"}} className="navbar-text-logo m-0 text-white">LOAN REMINDER</Link>
                </div>
                {/* if you're getting the data from the api, it shows a spinned for loading */}
                {isLoading ? <div className="spinner-border text-white" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>:
                <div className='col-4 d-flex justify-content-end z-1'>
                    {/* if you are not loading, then if the user is signed in it creates the Menu toggle button else it makes Log in and sign up links */}
                    {signedIn? <UserNavbar user={user} setIsMenuOpen ={setIsMenuOpen} logOut={logOut} isMenuOpen={isMenuOpen}/> : <nav className={'d-flex gap-4'}>
                    <Link to={"/signIn"} className="navbar-text" >LOG IN</Link>
                    <Link to={"/signUp"} className="navbar-text" >SIGN UP</Link>
                    </nav>}
                </div>}
            </div>
        </header>
        </>

    )
}
export default Header;
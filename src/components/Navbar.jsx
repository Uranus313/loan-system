import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import '../component styles/Navbar.css'
import {Link} from "react-router-dom";
import { Badge } from 'react-bootstrap';
import { ToastContainer,toast } from "react-toastify";

function UserNavbar({user,isMenuOpen,logOut,setIsMenuOpen}) {
  let expand = false;
  return (
    <>
        <Navbar key={expand} expand={expand} className={'navbar-dark'}>
          <Container fluid>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} className={'border-white border-2'} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                {/* showing the username */}
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`} className={'text-black username-title fw-bolder d-flex '}>
                  {user?.username}{user?.isAdmin && <h6 className='p-0 m-0 d-flex align-items-end'><Badge bg="secondary">Admin</Badge></h6> }
                </Offcanvas.Title>
              </Offcanvas.Header>
              <hr className={'mb-3 mt-0 '}></hr>
              <Offcanvas.Body>
                {/* the links to the other pages */}
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Link className={'text-decoration-none mb-2 p-2 menu-option'} to={'/user/profileInfo'}>My Profile</Link>
                  <Link className={'text-decoration-none mb-2 p-2 menu-option'} to={'/user/editProfile'}>Edit Profile</Link>
                  <Link className={'text-decoration-none mb-2 p-2 menu-option'} to={'/user/myLoans'} >Loans</Link>
                  <Link className={'text-decoration-none mb-2 p-2 menu-option'} to={'/user/addLoan'}>Add Loan</Link>
                  <Link className={'text-decoration-none mb-2 p-2 menu-option'} to={'/user/notifications'}>Notifications</Link>
                  <Link state={{hello : 1}} className={'text-decoration-none mb-2 p-2 menu-option'} style={{display: "block",textWrap: "nowrap"}} to={'/user/addPayment'} >Submit Debt Payment</Link>
                  <Link to={'/admin/allUsers'} className={user?.isAdmin? 'text-decoration-none mb-2 p-2 menu-option' : 'd-none'} >All Users</Link>
                  <Link to={'/admin/allLoans'} className={user?.isAdmin? 'text-decoration-none mb-2 p-2 menu-option' : 'd-none'} >All Loans</Link>

                  <Link className={'text-decoration-none mb-2 p-2 logout-option'} onClick={() => {localStorage.removeItem("auth-token"); logOut();
                    }} to={'/signIn'}>log out</Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar> 
    </>
  );
}

export default UserNavbar;
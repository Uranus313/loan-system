import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import '../component styles/Navbar.css'
import {Link} from "react-router-dom";


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
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`} className={'text-black username-title fw-bolder'}>
                  {user?.username}
                </Offcanvas.Title>
              </Offcanvas.Header>
              <hr className={'mb-3 mt-0 '}></hr>
              <Offcanvas.Body>
                {/* the links to the other pages */}
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Link className={'text-decoration-none mb-2 p-2 menu-option'} to={'/profileInfo'}>My Profile</Link>
                  <Link className={'text-decoration-none mb-2 p-2 menu-option'} to={'/editProfile'}>Edit Profile</Link>
                  <Link className={'text-decoration-none mb-2 p-2 menu-option'} >Loans</Link>
                  <Link className={'text-decoration-none mb-2 p-2 menu-option'} to={'/addLoan'}>Add Loan</Link>
                  <Link className={'text-decoration-none mb-2 p-2 menu-option'} style={{display: "block",textWrap: "nowrap"}}>Submit Debt Payment</Link>
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
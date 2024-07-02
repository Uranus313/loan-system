import { Link } from "react-router-dom";
function UserSideMenu({user,isMenuOpen,logOut}){

    return(
        <div style={{display: isMenuOpen? "flex": "none", backgroundColor: "yellowgreen", flexDirection: "column",alignItems: "center" }}>
                    {/* showing the username */}
                    <h3>{user?.username}</h3>
                    {/* the links to the other pages */}
                    <Link to={'/profileInfo'}>My Profile</Link>
                    <Link to={'/editProfile'}>Edit Profile</Link>
                    <Link>Loans</Link>
                    <Link to={'/addLoan'}>Add Loan</Link>
                    <Link style={{display: "block",textWrap: "nowrap"}}>Submit Debt Payment</Link>
                    <Link onClick={() => {localStorage.removeItem("auth-token"); logOut();
                    }} to={'/signIn'}>log out</Link>

        </div>
    );
}
export default UserSideMenu;
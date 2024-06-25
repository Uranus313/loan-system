import { Link } from "react-router-dom";
function UserSideMenu({user,isMenuOpen}){
    return(
        <div style={{display: isMenuOpen? "flex": "none", backgroundColor: "yellowgreen", flexDirection: "column",alignItems: "center" }}>
                    <Link>{user.username}</Link>
                    <Link>Loans</Link>
                    <Link>Add Loan</Link>
                    <Link style={{display: "block",textWrap: "nowrap"}}>Submit Debt Payment</Link>
                    <Link>log out</Link>

        </div>
    );
}
export default UserSideMenu;
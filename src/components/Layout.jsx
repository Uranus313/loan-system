import { Link, Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { useState } from "react";
import UserSideMenu from "./UserSideMenu";
function Layout(){
    let [isMenuOpen,setIsMenuOpen] = useState(false);
    let testUser = {userID : "hello12", username : "Uranus", firstName : "Mehrbod", middleName : null,lastName : "Hashemi", email: "mehrbodmh82@gmail.com" ,dateOfBirth : "2003-11-23",password: "12345678", IDNumber : "313"}
    let [user,setUser] = useState(testUser);
    return(
        <>
            <div style={{display: "flex",width: "100%",height: "100%"}}>
                <div style={{width: "100%"}}>
                    <Header menuControl={() => setIsMenuOpen(!isMenuOpen) } user = {user}/>
                    <Outlet/>
                    <Footer/>
                </div>
                <UserSideMenu user={user} isMenuOpen={isMenuOpen}/>
            </div>
            
        </>
        
    )

}

export default Layout;
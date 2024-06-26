import { Link, Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { useState } from "react";
import UserSideMenu from "./UserSideMenu";

function Layout(){
    let [isMenuOpen,setIsMenuOpen] = useState(false);
    let testUser = {user_id : "hello12", username : "Uranus", firstName : "Mehrbod", middleName : null,lastName : "Hashemi", email: "mehrbodmh82@gmail.com" ,dateOfBirth : "2003-11-23",password: "12345678", IDNumber : "313"}
    let [user,setUser] = useState(testUser);
    return(
        <>
            <div style={{display: "flex",width: "100%",minHeight: "100%"}}>
                <div style={{width: "100%"}}>
                    <Header menuControl={() => setIsMenuOpen(!isMenuOpen) } user = {user}/>
                    <Outlet context={user} />
                    <Footer/>
                </div>
                <UserSideMenu user={user} isMenuOpen={isMenuOpen}/>
            </div>
            
        </>
        
    )

}

export default Layout;
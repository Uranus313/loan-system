import { Link, Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { createContext, useEffect, useState } from "react";
import UserSideMenu from "./UserSideMenu";
import useCheckToken from "../hooks/useCheckToken";
import SignInContext from "../contexts/SignInContext";
import { useQueryClient } from "@tanstack/react-query";
import UserNavbar from "./Navbar.jsx";

//this is the layout page, it just puts together the header, main body, footer and side menu(if visible)

function Layout(){
    let [isMenuOpen,setIsMenuOpen] = useState(false);
    let {data: user,error,isLoading} = useCheckToken();
    let [signedIn, setSignedIn] = useState();
    
    console.log(user);
    console.log(error);
    console.log(isLoading);
    let queryClient = useQueryClient();
    function handleLogOut(){
        // user = null;
        setSignedIn(false);
        setIsMenuOpen( false);
        queryClient.invalidateQueries(["user"]);
        // console.log("test")
    }

    useEffect(() => {
        if(error){
            handleLogOut();
        }else{
            if(user){
                setSignedIn(true);
            }
        }
    },[user]);

    return(
        <>
            <div style={{display: "flex",width: "100%",minHeight: "100%"}}>
                <div style={{width: "100%",minHeight:"100vh"}} className="d-flex flex-column justify-content-between">
                    <Header user={error? null :user} logOut={handleLogOut} setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} menuControl={() => setIsMenuOpen(!isMenuOpen) } signedIn ={signedIn} isLoading={isLoading}  />
                        <SignInContext.Provider value={{signedIn: signedIn , setSignedIn: setSignedIn,handleLogOut}}>
                            {/* <div style={{height:"70vh"}}> */}
                            <div>
                            <Outlet context={{user : error? null :user,isLoading: isLoading}} />

                            </div>
                        </SignInContext.Provider>
                    <Footer/>
                </div>
                {/* if isMenuOpen is false then the menu is hidden */}
                {/*<UserSideMenu user={error? null :user} logOut={handleLogOut}    isMenuOpen={isMenuOpen}/>*/}

            </div>
            
        </>
        
    )

}

export default Layout;
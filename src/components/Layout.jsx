import { Link, Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { createContext, useEffect, useState } from "react";
import UserSideMenu from "./UserSideMenu";
import useCheckToken from "../hooks/useCheckToken";
import SignInContext from "../contexts/SignInContext";

function Layout(){
    let [isMenuOpen,setIsMenuOpen] = useState(false);
    let {data: user,error,isLoading} = useCheckToken();
    let [signedIn, setSignedIn] = useState();
    console.log(user);
    console.log(error);
    console.log(isLoading);

    function handleLogOut(){
        // user = null;
        setSignedIn(false);
        setIsMenuOpen( false);
        console.log("test")
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
                <div style={{width: "100%"}}>
                    <Header menuControl={() => setIsMenuOpen(!isMenuOpen) } signedIn ={signedIn} isLoading={isLoading}  />
                        <SignInContext.Provider value={{signedIn: signedIn , setSignedIn: setSignedIn}}>
                            <Outlet context={{user : error? null :user}} />
                        </SignInContext.Provider>
                    <Footer/>
                </div>
                <UserSideMenu user={error? null :user} logOut={handleLogOut}    isMenuOpen={isMenuOpen}/>
            </div>
            
        </>
        
    )

}

export default Layout;
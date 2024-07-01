import { Link, Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { createContext, useEffect, useState } from "react";
import UserSideMenu from "./UserSideMenu";
import useCheckToken from "../hooks/useCheckToken";
import SignInContext from "../contexts/SignInContext";
import { useQueryClient } from "@tanstack/react-query";

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
                <div style={{width: "100%"}}>
                    <Header menuControl={() => setIsMenuOpen(!isMenuOpen) } signedIn ={signedIn} isLoading={isLoading}  />
                        <SignInContext.Provider value={{signedIn: signedIn , setSignedIn: setSignedIn}}>
                            <Outlet context={{user : error? null :user,isLoading: isLoading}} />
                        </SignInContext.Provider>
                    <Footer/>
                </div>
                <UserSideMenu user={error? null :user} logOut={handleLogOut}    isMenuOpen={isMenuOpen}/>
            </div>
            
        </>
        
    )

}

export default Layout;
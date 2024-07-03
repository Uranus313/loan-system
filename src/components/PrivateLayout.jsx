import { Outlet,Navigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import tokenChecker from "../functions/tokenChecker";
import Loading from "./Loading";
function PrivateLayout(){
    if(tokenChecker() == false){
        console.log("ouuut")
        return (<Navigate to={"/signIn"} />)
    }
    let context = useOutletContext();
    return(
        <>
            {context.isLoading? <Loading /> : <>
            {!context.user && <Navigate to={"/signIn"} />}
        
            <Outlet context={context}/>
            </>}
        </>
        
        
        
        
    )
}
export default PrivateLayout;
import { Outlet } from "react-router-dom";
function Layout(){
    return(
        <>
            <nav>navigation bar</nav>
            <Outlet/>
            <footer>footer</footer>
        </>
        
    )

}

export default Layout;
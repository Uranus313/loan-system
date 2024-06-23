import '../component styles/Header.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function Header(){
    return(
        <header className={"d-flex justify-content-between text-white p-2"}>
            <p className={"mt-2 navbar-text-logo"}>LOAN REMINDER</p>
            <img  className={'navbar-img-logo'} src={'./src/assets/logo.png'}/>
            <nav className={'d-flex gap-4'}>
                <a className={"mt-2 navbar-text"} href={''}>LOG IN</a>
                <a className={"mt-2 navbar-text"} href={''}>SIGN UP</a>
            </nav>
        </header>
    )
}
export default Header;



// <header style={{display: "flex", justifyContent: "space-between"}}>
// <img src={'/src/assets/logo.png'} className={'navbar-image'}/>
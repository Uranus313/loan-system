function Header(){
    return(
        <header style={{display: "flex",justifyContent: "space-between"}}> 
            <p>Logo</p>
            <nav style={{display: "flex"}} >
                <p>log in</p>
                <p>sign up</p>
            </nav>
        </header>
    )
}
export default Header;
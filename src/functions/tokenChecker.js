function tokenChecker(){
    let token = localStorage.getItem("auth-token");
    console.log(token)
    if ( token == null){
        return false;
    }else{
        return token;
    }
}
export default tokenChecker;
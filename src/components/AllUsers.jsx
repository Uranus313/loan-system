import { useOutletContext } from "react-router-dom";
import useGetUsers from "../hooks/useGetUsers";
import Loading from "./Loading";
import UserCard from "./UserCard";
import { ToastContainer,toast } from "react-toastify";

function AllUsers(){
    let {data: users,error : fetchError,isLoading} = useGetUsers();
    let {user: originalUser} = useOutletContext();
    return (
        <>
        {isLoading? <Loading /> : users?.map((user,index) =>
        {   
            if (user.user_id != originalUser.user_id){
                return(<div key={index} className="d-flex">
                    <UserCard user={user} />
                </div>)
            }else{
                return null;
            }
        } 
        ) }
        </>
    );
}
export default AllUsers;
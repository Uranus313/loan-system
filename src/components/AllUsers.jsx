import { useOutletContext } from "react-router-dom";
import useGetUsers from "../hooks/useGetUsers";
import Loading from "./Loading";
import UserCard from "./UserCard";
import { ToastContainer,toast } from "react-toastify";

function AllUsers(){
    let {data: users,error : fetchError,isLoading} = useGetUsers();
    let {user: originalUser} = useOutletContext();
    return (
        <div className="row container-fluid mx-auto my-4">
        {isLoading? <Loading /> : users?.map((user,index) =>
        {   
            if (user.user_id != originalUser.user_id){
                return(<div key={index} className="d-flex col-12 col-sm-6 col-md-4 col-lg-3 align-items-center justify-content-center">
                    <UserCard user={user} />
                </div>)
            }else{
                return null;
            }
        } 
        ) }
        </div>
    );
}
export default AllUsers;
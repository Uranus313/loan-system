import useGetUsers from "../hooks/useGetUsers";
import Loading from "./Loading";
import UserCard from "./UserCard";
function AllUsers(){
    let {data: users,error : fetchError,isLoading} = useGetUsers();
    return (
        <div className="row container-fluid mx-auto my-4">
        {isLoading? <Loading /> : users?.map((user,index) => 
        <div key={index} className="d-flex col-12 col-sm-6 col-md-4 col-lg-3 align-items-center justify-content-center">
            <UserCard user={user} />
        </div>) }
        </div>
    );
}
export default AllUsers;
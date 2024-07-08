import useGetUsers from "../hooks/useGetUsers";
import Loading from "./Loading";
import UserCard from "./UserCard";
function AllUsers(){
    let {data: users,error : fetchError,isLoading} = useGetUsers();
    return (
        <>
        {isLoading? <Loading /> : users?.map((user,index) => 
        <div key={index} className="d-flex">
            <UserCard user={user} />
        </div>) }
        </>
    );
}
export default AllUsers;
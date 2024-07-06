import { useNavigate } from "react-router-dom";
import useGetNotifications from "../hooks/useGetNotifications";
import Loading from "./Loading";
import NotificationCard from "./NotificationCard";
import { Button } from "react-bootstrap";
function NotificationsPage(){
    let {data: norifications,error : fetchError,isLoading} = useGetNotifications();
    let navigate = useNavigate();
    return (
        <>
        <Button onClick={() => navigate(-1)}>back</Button>
        {isLoading? <Loading /> : norifications?.map((notification,index) => 
        <div key={index} className="d-flex">
            <NotificationCard notificiation={notification}  />
        </div>) }
        </>
    );
}
export default NotificationsPage;
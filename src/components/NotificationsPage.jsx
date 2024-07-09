import { useNavigate } from "react-router-dom";
import useGetNotifications from "../hooks/useGetNotifications";
import Loading from "./Loading";
import NotificationCard from "./NotificationCard";
import { Button } from "react-bootstrap";
import { ToastContainer,toast } from "react-toastify";

function NotificationsPage(){
    let {data: norifications,error : fetchError,isLoading} = useGetNotifications();
    let navigate = useNavigate();
    return (
        <>
        <div className="row d-flex m-3">
            {isLoading? <Loading /> : norifications?.map((notification,index) => 
            <div key={index} className="d-flex col-12 mb-3">
                <NotificationCard notificiation={notification}  />
            </div>) }
        </div>

        </>
    );
}
export default NotificationsPage;
import { useNavigate } from "react-router-dom";
import useGetNotifications from "../hooks/useGetNotifications";
import Loading from "./Loading";
import NotificationCard from "./NotificationCard";
import { Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css'
import '../component styles/NotificationsPage.css'


function NotificationsPage(){
    let {data: notifications,error : fetchError,isLoading} = useGetNotifications();
    let navigate = useNavigate();
    return (
        <>
        <Button onClick={() => navigate(-1)}>BACK</Button>
        <div className="container row mt-5">
            {isLoading? <Loading /> : notifications?.map((notification,index) => 
            <div key={index} className="d-flex col-12 col-md-6 col-lg-4 text-center">
                <NotificationCard notificiation={notification}/>
            </div>) }
        </div>
        </>
    );
}
export default NotificationsPage;
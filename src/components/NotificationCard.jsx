import Card from 'react-bootstrap/Card';
import NotificationPopUp from './NotificationPopUp';
import Badge from 'react-bootstrap/Badge';
import { ToastContainer,toast } from "react-toastify";

function NotificationCard({notificiation}) {
  return (
    <div className='d-flex flex-column col-12'>
    <div className={`${notificiation.isRead ? "d-none" : "d-flex"}`}><Badge bg="danger" className='rounded-5'>New</Badge></div>
    <Card className={`h-100 w-100 m-0 rounded-5 shadow-sm ${notificiation.isRead ? "bg-info-subtle" : " bg-warning-subtle"}`}>
      <Card.Body className='w-100 p-1 px-3 d-flex align-items-center justify-content-between'>
        <Card.Title className="text-truncate m-0" style={{ fontWeight: 'bold' }}>{notificiation.title}</Card.Title>
        <Card.Text className="text-muted m-0"><strong>SendDate: </strong>{new Date(notificiation.sendDate).toLocaleDateString()}</Card.Text>
        <NotificationPopUp notification={notificiation} />
      </Card.Body>
    </Card>
    </div>
  );
}

export default NotificationCard;
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import LoanPopUp from './LoanPopUp';
import NotificationPopUp from './NotificationPopUp';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../component styles/NotificationCard.css'



function NotificationCard({notificiation}) {
  return (
    <Card style={{ width: '18rem' }} className={"notif-card " + notificiation.isRead? "bg-secondary-subtle" : "bg-danger-subtle"}>
      <Card.Body>
        <Card.Title>{notificiation.title}</Card.Title>
        <hr className='mb-5'></hr>
        <Card.Text className='fw-bold mb-5'>{notificiation.sendDate}</Card.Text>

        <NotificationPopUp notification={notificiation} />
      </Card.Body>
    </Card>
  );
}

export default NotificationCard;
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import LoanPopUp from './LoanPopUp';
import NotificationPopUp from './NotificationPopUp';

function NotificationCard({notificiation}) {
  return (
    <Card style={{ width: '18rem' }} className={notificiation.isRead? "bg-info-subtle" : "bg-danger-subtle"}>
      <Card.Body>
        <Card.Title>{notificiation.title}</Card.Title>
        <Card.Text>{notificiation.sendDate}</Card.Text>
        <NotificationPopUp notification={notificiation} />
      </Card.Body>
    </Card>
  );
}

export default NotificationCard;
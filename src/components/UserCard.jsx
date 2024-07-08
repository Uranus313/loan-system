import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Badge } from 'react-bootstrap';
import UserPopUp from './UserPopUp';
function UserCard({user}) {
  return (
    <Card style={{ width: '18rem' }}>
      {/* <Card.Img variant="top" className='d-none' src={imgURL? imgURL:null} /> */}
      <Card.Body>
        <Card.Title>{user.username}</Card.Title>
        <Card.Text>{user.firstName}{user.middleName && " "+user.middleName}{" "+user.lastName}</Card.Text>
        {user?.isAdmin && <Badge bg="primary">Admin</Badge> }

        <UserPopUp user={user}/>
      </Card.Body>
    </Card>
  );
}

export default UserCard;
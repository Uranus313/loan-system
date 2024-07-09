import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Badge } from 'react-bootstrap';
import UserPopUp from './UserPopUp';
import { ToastContainer,toast } from "react-toastify";

function UserCard({user}) {
  return (
    <Card className='m-0 mb-4'>
      {/* <Card.Img variant="top" className='d-none' src={imgURL? imgURL:null} /> */}
      <Card.Body className='m-0'>
        <Card.Title className='mb-4 text-primary'>{user.username}</Card.Title>
        <Card.Text><strong>FirstName: </strong>{user.firstName}</Card.Text>
        <Card.Text><strong>MiddleName: </strong>{user.middleName && " "+user.middleName}</Card.Text>
        <Card.Text><strong>LastName: </strong>{" "+user.lastName}</Card.Text>
        <div className='d-flex flex-column gap-1 col-7 mx-auto'>
        {user?.isAdmin && <Badge className='col-5 rounded-5' bg="primary">Admin</Badge> }
        <UserPopUp user={user}/>
        </div>
       
      </Card.Body>
    </Card>
  );
}

export default UserCard;
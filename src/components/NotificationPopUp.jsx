import { useState } from 'react';
import { Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DebtRow from './DebtRow';
import { useNavigate } from 'react-router-dom';
function NotificationPopUp({notification}) {
    let [modalShow,setModalShow] = useState(false);
    let navigate = useNavigate();

  return (
    <>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        expand
      </Button>
    <Modal
      size="lg"
      show = {modalShow}
      onHide= {() => setModalShow(false)}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {notification.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
            <p>{notification.text}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setModalShow(false)}>Close</Button>
      </Modal.Footer>
    </Modal>
    </>
  );
}
export default NotificationPopUp;

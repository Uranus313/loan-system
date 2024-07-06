import { useState } from 'react';
import { Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DebtRow from './DebtRow';
import { useNavigate } from 'react-router-dom';
import APIClient from '../connections/APIClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useGetDebtLoan from '../hooks/useGetDebtLoan';
import Loading from './Loading';
function NotificationPopUp({notification}) {
    let [modalShow,setModalShow] = useState(false);
    let navigate = useNavigate();
    const apiClient = new APIClient("/user/notifications");
    const queryClient = useQueryClient();
    const submitReadNotification = useMutation({
        mutationFn: (notification) => apiClient.putWithToken(notification),
        onSuccess: (res ) => {
            queryClient.invalidateQueries(["notification"]);

            // navigate("/");
        },
        onError: (error) =>{
            console.log(error)
            console.log(error.response?.data.detail)
        }
    });
    let {data: loan,error : fetchError,isLoading} = useGetDebtLoan(notification.debt_id);
    // return (
    //     <>
    //     <Button onClick={() => navigate(-1)}>back</Button>
    //     {isLoading? <Loading /> : norifications?.map((notification,index) => 
    //     <div key={index} className="d-flex">
    //         <NotificationCard notificiation={notification}  />
    //     </div>) }
    //     </>
    // );
  return (
    <>
        <Button variant="primary" onClick={() => {setModalShow(true); submitReadNotification.mutate([{notification_id : notification.notification_id, isRead : true}])}}>
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
        {isLoading? <Loading /> : <p>{notification.text}</p>}
              
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalShow(false)}>Close</Button>
          
          {loan && (loan?.debtNumber > loan?.paidDebtNumber) && <Button onClick={() => navigate('/user/addPayment',{state: {loan_id : loan.loan_id}})}>pay debt</Button>}
        </Modal.Footer>
      </Modal>
      </>  
  );
}
export default NotificationPopUp;

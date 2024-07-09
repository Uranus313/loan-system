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
import { ToastContainer,toast } from "react-toastify";

function NotificationPopUp({notification}) {
    let [modalShow,setModalShow] = useState(false);
    let navigate = useNavigate();
    const apiClient = new APIClient("/user/notifications");
    const queryClient = useQueryClient();
    const submitReadNotification = useMutation({
        mutationFn: (notification) => apiClient.putWithToken(notification),
        onSuccess: (res ) => {
            queryClient.invalidateQueries(["notification"]);
            toast("your message is marked as read now",{onOpen: () => {setFormFunction(false)}, autoClose: 500,pauseOnHover: false});      
        },
        onError: (error) =>{
            console.log(error)
            console.log(error.response?.data.detail)
            Array.isArray(error.response?.data.detail)?  error.response?.data.detail.map((item,index) => {toast(item.msg.includes("Value error,")?item.msg.replace("Value error, ",''): capitalizeFirstLetter(item.loc[item.loc.length-1]) + " " + item.msg.substr(item.msg.indexOf(" ")+1),{type: "error"})}) : toast(error.response?.data.detail ,{type: "error"})
        }
    });

            // navigate("/");
        
            
    let {data: loan,error : fetchError,isLoading, refetch} = useGetDebtLoan(notification.debt_id);
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
        <Button variant="primary" className='rounded-5' onClick={() => {setModalShow(true);if(notification.debt_id){refetch();} if(notification.isRead == false){
          submitReadNotification.mutate([{notification_id : notification.notification_id, isRead : true}])
        } }}>
          Read
        </Button>
      <Modal
        size="lg"
        show = {modalShow}
        onHide= {() => setModalShow(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
        <ToastContainer />
            
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

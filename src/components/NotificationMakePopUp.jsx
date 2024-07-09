import { useContext, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { InputGroup, Form,Row,Col, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import APIClient from '../connections/APIClient';


import SignInContext from '../contexts/SignInContext';
function NotificationMakePopUp({user}){
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [active,setActive] = useState(true);
    const titleRef = useRef('');
    const textRef = useRef('');
    const apiClient = new APIClient('/user/notifications');
    const queryClient = useQueryClient();
    const addNotif = useMutation({
      mutationFn: (notification) => apiClient.postWithToken(notification),
      onSuccess: () =>{
          queryClient.invalidateQueries(["notification"]);
          toast("message sent ",{onClose: () => {handleClose();}, type: 'success',autoClose: 500,pauseOnHover: false});
          
      },
      onError: (error) =>{
          console.log("pppp")
          console.log(error)
          if(error.response){
              toast(Array.isArray(error.response?.data.detail)?  error.response?.data.detail.map((item,index) =>  {item.msg.includes("Value error,")?item.msg.replace("Value error, ",''): capitalizeFirstLetter(item.loc[item.loc.length-1]) + " " + item.msg.substr(item.msg.indexOf(" ")+1)}) : error.response?.data.detail ,{type: "error",onClose : ()=> console.log("hi")})
          }else{
              toast(error.message,{type: "error"})
          }
          setActive(true);
      }});
    function handleSubmit(event){
      event.preventDefault();
      if(titleRef.current.value.trim() == ''){
          toast("title cant be empty", {type: "error"});
          return;
      }
      setActive(false);
      addNotif.mutate({title: titleRef.current.value.trim(), text : textRef.current.value.trim(),user_id :  user.user_id,sendDate: new Date().toISOString().split("T")[0] } );
    }
    return (
      <>
        <div>
        <ToastContainer />
        </div>
        {/* this button appears in the ProfileInfo page, this makes the popUp show up */}
        <Button variant="primary" onClick={handleShow}>
  
          Send Message
        </Button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Send message</Modal.Title>
        <ToastContainer />

          </Modal.Header>
          <Form className='p-0 m-0' onSubmit={(event) => handleSubmit(event)}>
  
          <Modal.Body> 
                  <Form.Group as={Row}  controlId="formPlaintextPassword">
                      <Form.Label column sm="2">
                          Title
                      </Form.Label>
                      <Col sm="10">

                          <Form.Control type="text" placeholder="Title" ref={titleRef}/>

                      </Col>
                      <Form.Label column sm="2">
                          Text
                      </Form.Label>
                      <Col sm="10">
                          <Form.Control type="text" placeholder="text" ref={textRef}/>

                      </Col>
                  </Form.Group>
              
              
          
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={active? handleClose : null}>
              Cancel
            </Button>
            <Button variant="danger" type='submit' >
              {active? "Send" : <Spinner variant='light' size='sm'/>}
            </Button>
          </Modal.Footer>
          </Form>
        </Modal>
      </>
    );
}
export default NotificationMakePopUp;
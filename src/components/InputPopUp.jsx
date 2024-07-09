import { useContext, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { InputGroup, Form,Row,Col, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import APIClient from '../connections/APIClient';
import SignInContext from '../contexts/SignInContext';
// this component is for the pop up for delete account in ProfileInfo, maybe the button for making the pop Up appear needs some improvments , I don't think any more edits is needed for now
function InputPopUp() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [active,setActive] = useState(true);
  const passwordRef = useRef('');
  const apiClient = new APIClient('user');
  const {handleLogOut} = new useContext(SignInContext);
  const queryClient = useQueryClient();
  const delAccount = useMutation({
    mutationFn: (password) => apiClient.delWithToken(password),
    onSuccess: () =>{
        queryClient.invalidateQueries(["user"]);
        localStorage.removeItem('auth-token');
        handleLogOut();
        toast("your account successfully deleted",{onClose: () => {handleClose();navigate("/")}, type: 'success',autoClose: 1000,pauseOnHover: false});
        
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
    if(passwordRef.current.value.trim() == ''){
        toast("password cant be empty", {type: "error"});
        return;
    }
    setActive(false);
    delAccount.mutate(passwordRef.current.value.trim() );
  }
  return (
    <>
      <div>
      <ToastContainer />
      </div>
      {/* this button appears in the ProfileInfo page, this makes the popUp show up */}
      <Button variant="primary" className='bg-danger border-0 rounded-3' onClick={handleShow}>

        Delete Account
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Form className='p-0 m-0' onSubmit={(event) => handleSubmit(event)}>

        <Modal.Body> 
                <Form.Group as={Row}  controlId="formPlaintextPassword">
                    <Form.Label column sm="2">
                        Password
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control type="password" placeholder="Password" ref={passwordRef}/>
                    </Col>
                </Form.Group>
            
            
        
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={active? handleClose : null}>
            Cancel
          </Button>
          <Button variant="danger" type='submit' >
            {active? "Delete" : <Spinner variant='light' size='sm'/>}
          </Button>
        </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}


export default InputPopUp;
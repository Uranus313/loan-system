import { useState } from 'react';
import { Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DebtRow from './DebtRow';
import { useNavigate } from 'react-router-dom';
import { useQueryClient ,useMutation} from '@tanstack/react-query';
import APIClient from '../connections/APIClient';
function LoanPopUp({title,rows,debts,user}) {
    let [modalShow,setModalShow] = useState(false);
    let [remainingDebtsShow,SetRemainingDebtsShow] = useState(false);
    let [overdueDebtsShow,SetOverdueDebtsShow] = useState(false);
    let [paidDebtsShow,SetPaidDebtsShow] = useState(false);
    let navigate = useNavigate();
    let queryClient = useQueryClient();
    let apiClient = new APIClient("user/loans")
    const checkOut = useMutation({
      mutationFn: (loan) => apiClient.putWithToken(loan),
      onSuccess: (res ) => {
          queryClient.invalidateQueries(["loans"]);

          // navigate("/");
      },
        onError: (error) =>{
          console.log(error)
          console.log(error.response?.data.detail)
      }
      });
      let apiClient2 = new APIClient("user/loans/" + debts[0].loan_id)
      const deleteLoan = useMutation({
        mutationFn: (loan) => apiClient2.delWithToken(loan),
        onSuccess: (res ) => {
            queryClient.invalidateQueries(["loans"]);
  
            // navigate("/");
        },
          onError: (error) =>{
            console.log(error)
            console.log(error.response?.data.detail)
        }
        });
  
    let counter = 0;
  return (
    <>
      <Button variant="primary" className='mt-5' onClick={() => {setModalShow(true); console.log(user)}}>
        Show More Detailes
      </Button>
    <Modal
      size="lg"
      show = {modalShow}
      onHide= {() => setModalShow(false)}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" className='text-primary'>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        
        {rows.map((row,index) => 
        {if(row.text || row.text == 0) {return (<div key={index} className='d-flex w-100 justify-content-between'>
          <strong>{row.title}</strong>
          <p >{row.text}</p>
        </div>);}else{ return null}}
        )}
        {debts && 
            <div className='d-flex flex-column'>
                <Button variant="primary" className='text-white mt-3' onClick={remainingDebtsShow? () => SetRemainingDebtsShow(false):() => SetRemainingDebtsShow(true)}>{remainingDebtsShow? "hide remaining debts" : "show remaining debts"}</Button>
                <div className={remainingDebtsShow? "d-block":"d-none"}>
                <h4>Remaining Debts</h4>
                <Table striped bordered hover className=' overflow-x-scroll'>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Amount</th>
                        <th>Deadline</th>
                        <th>Pay Date</th>
                        </tr>
                    </thead>
                    <tbody>
                      {debts.map((debt,index) => { 
                        if(!debt.paidDate){
                        counter++;
                        let temp = counter;
                        if(index == debts.length){
                            counter = 0;
                        }
                        return <DebtRow key={index} index={temp} amount={debt.amount} deadline={debt.deadline} paidDate={debt.paidDate} />}else{
                          if(index == debts.length){
                            counter = 0;
                        }
                        }})}

                    </tbody>
                </Table>
                </div>
                <hr />
                <Button variant="primary" className='text-white' onClick={overdueDebtsShow? () => SetOverdueDebtsShow(false):() => SetOverdueDebtsShow(true)}>{overdueDebtsShow? "hide overdue debts" : "show overdue debts"}</Button>
                <div className={overdueDebtsShow? "d-block":"d-none"}>
                <h4>Overdue Debts</h4>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Amount</th>
                        <th>Deadline</th>
                        <th>Pay Date</th>
                        </tr>
                    </thead>
                    <tbody>
                      {debts.map((debt,index) => { 
                        let today = new Date();
                        if(!debt.paidDate && new Date(debt.deadline) < today){
                        counter++;
                        let temp = counter;
                        if(index == debts.length){
                            counter = 0;
                        }
                        return <DebtRow key={index} index={temp} amount={debt.amount} deadline={debt.deadline} paidDate={debt.paidDate} />}else{
                          if(index == debts.length){
                            counter = 0;
                        }
                        }})}

                    </tbody>
                </Table>
                </div>
                <hr />

                <Button variant="primary" className='text-white' onClick={paidDebtsShow? () => SetPaidDebtsShow(false):() => SetPaidDebtsShow(true)} >{paidDebtsShow? "hide paid debts" : "show paid debts"}</Button>
                <div className={paidDebtsShow? "d-block":"d-none"}>
                <h4>Paid Debts</h4>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Amount</th>
                        <th>Deadline</th>
                        <th>Pay Date</th>
                        </tr>
                    </thead>
                    <tbody>
                      {debts.map((debt,index) => { 
                        if(debt.paidDate){
                        counter++;
                        let temp = counter;
                        if(index == debts.length){
                            counter = 0;
                        }
                        return <DebtRow key={index} index={temp} amount={debt.amount} deadline={debt.deadline} paidDate={debt.paidDate} />}else{
                          if(index == debts.length){
                            counter = 0;
                        }
                        }})}

                    </tbody>
                </Table>
                </div>
                
            </div>
        }
      </Modal.Body>
      <Modal.Footer>
        
        <Button onClick={() => setModalShow(false)}>Close</Button>
        <Button onClick={() => deleteLoan.mutate()}>Delete Loan</Button>
        {!user && user !== null && debts && !debts[debts.length-1].paidDate && <Button onClick={() => navigate('/user/addPayment',{state: {loan_id : debts[0].loan_id}})}>pay debt</Button>}
        {!user && user !== null && debts && !debts[debts.length-1].paidDate && <Button onClick={() => checkOut.mutate({loan_id : debts[0].loan_id, paidDate : new Date().toISOString().split("T")[0]})}>Check Out</Button>}
      </Modal.Footer>
    </Modal>
    </>
  );
}
export default LoanPopUp;

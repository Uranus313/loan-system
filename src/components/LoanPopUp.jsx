import { useState } from 'react';
import { Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DebtRow from './DebtRow';
import { useNavigate } from 'react-router-dom';
function LoanPopUp({title,rows,debts}) {
    let [modalShow,setModalShow] = useState(false);
    let [remainingDebtsShow,SetRemainingDebtsShow] = useState(false);
    let [overdueDebtsShow,SetOverdueDebtsShow] = useState(false);
    let [paidDebtsShow,SetPaidDebtsShow] = useState(false);
    let navigate = useNavigate();

    let counter = 0;
  return (
    <>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Launch vertically centered modal
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
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        
        {rows.map((row,index) => 
        {if(row.text || row.text == 0) {return (<div key={index} className='d-flex w-100 justify-content-between'>
            <p>{row.title}</p>
            <p >{row.text}</p>
        </div>);}else{ return null}}
        )}
        {debts && 
            <div className='d-flex flex-column '>
                <Button variant="primary" className='text-white' onClick={remainingDebtsShow? () => SetRemainingDebtsShow(false):() => SetRemainingDebtsShow(true)}>{remainingDebtsShow? "hide remaining debts" : "show remaining debts"}</Button>
                <div className={remainingDebtsShow? "d-block":"d-none"}>
                <h4>Remaining Debts</h4>
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
                        if(!debt.paidDate){
                        counter++;
                        let temp = counter;
                        if(index == debts.length){
                            counter = 0;
                        }
                        return <DebtRow key={index} index={temp} amount={debt.amount} deadline={debt.deadline} paidDate={debt.paidDate} />}})}

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
                        return <DebtRow key={index} index={temp} amount={debt.amount} deadline={debt.deadline} paidDate={debt.paidDate} />}})}

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
                        return <DebtRow key={index} index={temp} amount={debt.amount} deadline={debt.deadline} paidDate={debt.paidDate} />}})}

                    </tbody>
                </Table>
                </div>
                
            </div>
        }
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setModalShow(false)}>Close</Button>
        {debts && !debts[debts.length-1].paidDate && <Button onClick={() => navigate('/user/addPayment',{state: {loan_id : debts[0].loan_id}})}>pay debt</Button>}
      </Modal.Footer>
    </Modal>
    </>
  );
}
export default LoanPopUp;

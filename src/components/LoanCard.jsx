import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import LoanPopUp from './LoanPopUp';
import { ToastContainer,toast } from "react-toastify";

function LoanCard({imgURL , amount,bankName,startDate,debtNumber,paidDebtNumber,nextDebtDeadline,note,debts,user}) {
  return (
      <Card className='m-0 shadow-lg mb-4' style={{ width: '18rem', borderRadius: '10px', overflow: 'hidden' }}>
        {imgURL && <Card.Img variant="top" src={imgURL} style={{ height: '150px', objectFit: 'cover' }} />}
        <Card.Body className='p-4'>
          <Card.Title className='mb-3 text-primary'>{bankName}</Card.Title>
          <Card.Text className='mb-2'>
            <strong>Amount:</strong> {amount}
          </Card.Text>
          <Card.Text className='mb-2'>
            <strong>Start Date:</strong> {startDate}
          </Card.Text>
          <Card.Text className='mb-2'>
            <strong>Paid Debts:</strong> {paidDebtNumber} / {debtNumber}
          </Card.Text>
          <Card.Text className='mb-2'>
            <strong>Next Deadline:</strong> {nextDebtDeadline}
          </Card.Text>
        {user &&  <Card.Text><strong>User: </strong>{user.username}</Card.Text>}
        
        <div className='text-center'>
          <LoanPopUp 
              title={bankName} 
              rows={[
                { title: "Amount", text: amount }, 
                { title: "Total Debts", text: debtNumber }, 
                { title: "Paid Debts", text: paidDebtNumber }, 
                { title: "Next Debt", text: nextDebtDeadline }, 
                { title: "Note", text: note }
              ]} 
              debts={debts} user={user}
            />
        </div>

        </Card.Body>
      </Card>
  );
}

export default LoanCard;
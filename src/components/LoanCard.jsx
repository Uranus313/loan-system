import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import LoanPopUp from './LoanPopUp';
import 'bootstrap/dist/css/bootstrap.min.css'
import '../component styles/LoanCard.css'


function LoanCard({imgURL , amount,bankName,startDate,debtNumber,paidDebtNumber,nextDebtDeadline,note,debts}) {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" className='d-none' src={imgURL? imgURL:null} />
      <Card.Body>
        <Card.Title><span className='loan-card-info'>Bank:</span> {bankName}</Card.Title>
        <hr></hr>
        <Card.Text><span className='loan-card-info'>Loan Amount:</span> {amount}</Card.Text>
        <Card.Text><span className='loan-card-info'>Origination Date:</span> {startDate}</Card.Text>
        <Card.Text><span className='loan-card-info'>Paid Debts:</span> {paidDebtNumber} / {debtNumber}</Card.Text>
        <Card.Text><span className='loan-card-info'>Next Debt:</span> {nextDebtDeadline}</Card.Text>

        {/* <Button variant="primary">Go somewhere</Button> */}
        <LoanPopUp title={bankName} rows={[{title:"Amount",text: amount},{title:"Total debts",text: debtNumber},{title:"Paid Debts",text: paidDebtNumber},{title:"Next Debt",text: nextDebtDeadline},{title:"note",text: note}]} debts={debts}/>
      </Card.Body>
    </Card>
  );
}

export default LoanCard;
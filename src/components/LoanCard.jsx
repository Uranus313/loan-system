import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import LoanPopUp from './LoanPopUp';

function LoanCard({imgURL , amount,bankName,startDate,debtNumber,paidDebtNumber,nextDebtDeadline,note,debts}) {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" className='d-none' src={imgURL? imgURL:null} />
      <Card.Body>
        <Card.Title>{bankName}</Card.Title>
        <Card.Text>{amount}</Card.Text>
        <Card.Text>{startDate}</Card.Text>
        <Card.Text>{paidDebtNumber} / {debtNumber}</Card.Text>
        <Card.Text>{nextDebtDeadline}</Card.Text>

        {/* <Button variant="primary">Go somewhere</Button> */}
        <LoanPopUp title={bankName} rows={[{title:"Amount",text: amount},{title:"Total debts",text: debtNumber},{title:"Paid Debts",text: paidDebtNumber},{title:"Next Debt",text: nextDebtDeadline},{title:"note",text: note}]} debts={debts}/>
      </Card.Body>
    </Card>
  );
}

export default LoanCard;
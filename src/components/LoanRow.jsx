function LoanRow({loan,index}){
    return(<tr>
        <td>{index}</td>
        <td>{loan.loan_id}</td>
        <td>{loan.bank.name}</td>
        <td>{loan.bankType}</td>
        <td>{loan.amount}</td>
        <th>{loan.interest}</th>
        <td>{loan.startDate}</td>
        <td>{loan.endDate}</td>
        <td>{loan.paidDebtNumber}</td>
        <td>{loan.debtNumber}</td>
        

    </tr>)
}
export default LoanRow;
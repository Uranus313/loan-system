function DebtRow({index,amount,deadline,paidDate}){
    return(<tr>
        <td>{index}</td>
        <td>{amount}</td>
        <td>{deadline}</td>
        {paidDate? <td>{paidDate}</td>: <td>not paid</td>}
        

    </tr>)
}
export default DebtRow;
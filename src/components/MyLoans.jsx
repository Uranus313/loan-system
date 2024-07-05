import useGetLoans from "../hooks/useGetLoans";
import Loading from "./Loading";
import LoanCard from "./LoanCard";
function MyLoans(){
    let {data: loans,error : fetchError,isLoading} = useGetLoans();
    return (
        <>
        {isLoading? <Loading /> : loans?.map((loan,index) => 
        <div key={index} className="d-flex">
            <LoanCard bankName={loan?.bankType == "default"? loan.bank?.name : loan.customBank?.name} amount={loan.amount} paidDebtNumber={loan.paidDebtNumber} debtNumber={loan.debtNumber} nextDebtDeadline={loan.paidDebtNumber >= loan.debts.length? "all paid": loan.debts[loan.paidDebtNumber].deadline}note={loan.note} debts={loan.debts} startDate={loan.startDate} />
        </div>) }
        </>
    );
}
export default MyLoans;
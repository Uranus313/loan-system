import useGetAllLoans from "../hooks/useGetAllLoans";
import useGetLoans from "../hooks/useGetLoans";
import Loading from "./Loading";
import LoanCard from "./LoanCard";
import { ToastContainer,toast } from "react-toastify";

function AllLoans(){
    let {data: loans,error : fetchError,isLoading} = useGetAllLoans();
    return (
        <>
        {isLoading? <Loading /> : loans?.map((loan,index) => 
        <div key={index} className="d-flex">
            <LoanCard bankName={loan?.bankType == "default"? loan.bank?.name : loan.customBank?.name} amount={loan.amount} paidDebtNumber={loan.paidDebtNumber} debtNumber={loan.debtNumber} nextDebtDeadline={loan.paidDebtNumber >= loan.debts.length? "all paid": loan.debts[loan.paidDebtNumber].deadline}note={loan.note} debts={loan.debts} startDate={loan.startDate} user={loan.user} />
        </div>) }
        </>
    );
}
export default AllLoans;
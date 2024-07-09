import useGetLoans from "../hooks/useGetLoans";
import Loading from "./Loading";
import LoanCard from "./LoanCard";
import { ToastContainer,toast } from "react-toastify";

function MyLoans(){
    let {data: loans,error : fetchError,isLoading} = useGetLoans();
    return (
        <div className="row container-fluid mx-auto">
        {isLoading? <Loading /> : loans?.map((loan,index) => 
        <div key={index} className="d-flex col-12 col-sm-6 col-md-3 align-items-center justify-content-center">
            <LoanCard bankName={loan?.bankType == "default"? loan.bank?.name : loan.customBank?.name} amount={loan.amount} paidDebtNumber={loan.paidDebtNumber} debtNumber={loan.debtNumber} nextDebtDeadline={loan.paidDebtNumber >= loan.debts.length? "all paid": loan.debts[loan.paidDebtNumber].deadline}note={loan.note} debts={loan.debts} startDate={loan.startDate} />
        </div>) }
        </div>
    );
}
export default MyLoans;
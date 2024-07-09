import useGetAllLoans from "../hooks/useGetAllLoans";
import useGetLoans from "../hooks/useGetLoans";
import Loading from "./Loading";
import LoanCard from "./LoanCard";
import { ToastContainer,toast } from "react-toastify";

function AllLoans(){
    let {data: loans,error : fetchError,isLoading} = useGetAllLoans();
    return (
        <div className="row container-fluid mx-auto my-3">
        {isLoading? <Loading /> : loans?.map((loan,index) => 
        <div key={index} className="d-flex col-12 col-sm-6 col-md-4 col-lg-3 align-items-center justify-content-center">
            <LoanCard bankName={loan?.bankType == "default"? loan.bank?.name : loan.customBank?.name} amount={loan.amount} paidDebtNumber={loan.paidDebtNumber} debtNumber={loan.debtNumber} nextDebtDeadline={loan.paidDebtNumber >= loan.debts.length? "all paid": loan.debts[loan.paidDebtNumber].deadline}note={loan.note} debts={loan.debts} startDate={loan.startDate} user={loan.user} />
        </div>) }
        </div>
    );
}
export default AllLoans;
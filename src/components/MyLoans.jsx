import useGetLoans from "../hooks/useGetLoans";
import Loading from "./Loading";
import LoanCard from "./LoanCard";
import 'bootstrap/dist/css/bootstrap.min.css'
import '../component styles/MyLoans.css'



function MyLoans(){
    let {data: loans,error : fetchError,isLoading} = useGetLoans();
    return (
        <>
        
          <div className="container row mt-5">
          {isLoading? <Loading /> : loans?.map((loan,index) => 
            <div key={index} className="d-flex col-12 col-md-6 col-lg-4">
                <LoanCard bankName={loan?.bankType == "default"? loan.bank?.name : loan.customBank?.name} amount={loan.amount} paidDebtNumber={loan.paidDebtNumber} debtNumber={loan.debtNumber} nextDebtDeadline={loan.paidDebtNumber >= loan.debts.length? "all paid": loan.debts[loan.paidDebtNumber].deadline}note={loan.note} debts={loan.debts} startDate={loan.startDate} />
            </div>)}  
          </div>  

        </>
    );
}
export default MyLoans;
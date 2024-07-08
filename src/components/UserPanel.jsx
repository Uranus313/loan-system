import context from "react-bootstrap/esm/AccordionContext";
import { useOutletContext } from "react-router-dom";

function UserPanel(){
    let context = useOutletContext();
    return(
        <>

            <div className="d-flex justify-content-center mb-2 mt-5">
                <h1 style={{fontFamily:'Agency FB',fontWeight:'bold'}}>WELCOME TO OUR WEBSITE!!</h1>
            </div>

            <div className="d-flex justify-content-center mt-2">
                <div className="card text-center w-25 mt-5" style={{width: "18rem"}}>
                    <div className="card-header" style={{backgroundColor: "green", color: "white"}}> ADD LOANS TO KEEP TRACK OF THEM! </div>
                    <div className="card-body p-3">
                        <p className="card-text">
                            you can add your loans in here <br></br> so you would never forget them and keep track of them. <br></br>
                            by doing so, you can go about your life without <br></br> ever worrying of forgetting to pay your monthly debts.
                        </p>
                        <a href="#" className="btn" style={{backgroundColor:"green",color:"white"}}>Add Loan</a>
                    </div>
                </div>

                <div className="card text-center w-25 m-5" style={{width: "18rem"}}>
                    <div className="card-header bg-danger" style={{color: "white"}}>
                        MANAGE YOUR LOANS IN A FAST WAY
                    </div>
                    <div className="card-body p-3">
                        <p className="card-text">
                            You can always view your current loans, their status and their other information. <br></br>
                            you can easily manage and handle them in the loans tab. <br></br><br></br><br></br>
                        </p>
                        <a href="#" className="btn btn-danger">Manage Loans</a>
                    </div>
                </div>

            </div>


            <hr></hr>


            <div className="d-flex justify-content-center mt-2 mb-5">
                <div className="card text-center w-25 mt-5" style={{width: "18rem"}}>
                    <div className="card-header bg-secondary" style={{color: "white"}}>GET NOTIFICATIONS ABOUT YOUR LOANS</div>
                    <div className="card-body p-3">
                        <p className="card-text">
                            You don't need to check the website each day to know if the next debt time is close or not.
                            We will send you notifications whenever your debts are close so you can attend to your daily life without worry.
                        </p>
                        <a href="#" className="btn btn-secondary">Go To Notifications</a>
                    </div>
                </div>
            
                <div className="card text-center w-25 m-5" style={{width: "18rem"}}>
                    <div className="card-header bg-primary" style={{color: "white"}}>
                        SUBMIT PAYMENT DEBT
                    </div>
                    <div className="card-body p-3">
                        <p className="card-text">
                            You can submit your debt payments so we can update your loans status.
                            this way your loans status is always updated and you feel your step by step progress.
                            <br></br>
                            <br></br>
                        </p>
                        <a href="#" className="btn btn-primary">Submit Debt Payment</a>
                    </div>
                </div>

            </div>


        </>      
    )
}
export default UserPanel;
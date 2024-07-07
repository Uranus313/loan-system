import { useOutletContext } from "react-router-dom";
import InputPopUp from "./InputPopUp";
import 'bootstrap/dist/css/bootstrap.min.css'
import '../component styles/ProfileInfo.css'


//the page for seeing your profile info


function ProfileInfo(){
    let {user} = useOutletContext();
    return (

        //if you could separate the Labels and values it would be better  
        
        <div className={'d-flex flex-column align-items-center bg-gradient'}>
            <div className={'d-grid p-4 rounded-3 bg-alert info-box mt-5 mb-5'}>
                <h4 className="fw-bold">YOUR ACCOUNT INFORMATION</h4>
                <hr></hr>
                <div className={'d-flex justify-content-between mt-4'}>
                    <p className={'fw-bold'}> <span className={'info-row'}>Username:</span> {user?.username}</p>
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold'}><span className={'info-row'}>First name: </span> {user?.firstName}</p>
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold'}><span className={'info-row'}>Middle Name: </span>{user?.middleName}</p>
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold'}><span className={'info-row'}>Last Name: </span>{user?.lastName}</p>
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold'}><span className={'info-row'}>ID Number: </span>{user?.IDNumber}</p>
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold'}><span className={'info-row'}>Email: </span> {user?.email}</p>
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold'}><span className={'info-row'}>Date of Birth: </span> {user?.dateOfBirth} </p>
                </div>
                {/* delete account pop out button */}
                <InputPopUp />
            </div>
        </div>
    )
}
export default ProfileInfo;
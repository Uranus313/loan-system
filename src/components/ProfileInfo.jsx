import { useOutletContext } from "react-router-dom";
import InputPopUp from "./InputPopUp";
function ProfileInfo(){
    let {user} = useOutletContext();
    return (
        <div className={'d-flex flex-column align-items-center bg-gradient'}>
            <div className={'d-grid p-4 rounded-3 bg-secondary-subtle'}>
                <h4>Your Info</h4>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>Username : {user?.username}</p>
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>First name : {user?.firstName}</p>
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>Middle Name : {user?.middleName}</p>
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>Last Name : {user?.lastName}</p>
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>ID Number : {user?.IDNumber}</p>
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>Email : {user?.email}</p>
                </div>
                <div className={'d-flex justify-content-between'}>
                    <p className={'fw-bold me-3 '}>Date of Birth : {user?.dateOfBirth} </p>
                </div>
                <InputPopUp />
            </div>
        </div>
    )
}
export default ProfileInfo;
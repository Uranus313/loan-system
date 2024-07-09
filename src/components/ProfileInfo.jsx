import { useOutletContext } from "react-router-dom";
import InputPopUp from "./InputPopUp";


//the page for seeing your profile info


function ProfileInfo(){
    let {user} = useOutletContext();
    return (

        //if you could separate the Labels and values it would be better  
        
        <div className='d-flex flex-column align-items-center'>
        <div className='card p-4 rounded-3 shadow-lg h-100 m-5' style={{ backgroundColor: '#ffffff', maxWidth: '600px', width: '100%'}}>
          <h4 className='mb-4 text-primary my-4'>Your Info</h4>
          {[
            { label: 'Username', value: user?.username },
            { label: 'First Name', value: user?.firstName },
            { label: 'Middle Name', value: user?.middleName },
            { label: 'Last Name', value: user?.lastName },
            { label: 'ID Number', value: user?.IDNumber },
            { label: 'Email', value: user?.email },
            { label: 'Date of Birth', value: user?.dateOfBirth }
          ].map((info, idx) => (
            <div key={idx} className='d-flex justify-content-between m-2'>
              <p className='fw-bold text-secondary m-0 p-2'>{info.label}:</p>
              <div className="col-7 col-md-5 bg-dark-subtle d-flex justify-content-center rounded-3 align-items-center">
                <p className='text-dark m-0'>{info.value}</p>
              </div>
            </div>
          ))}
          <div className='text-center mt-4'>
            <InputPopUp />
          </div>
        </div>
      </div>
    )
}
export default ProfileInfo;
import InputPopUp from "./InputPopUp";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import teleg from '../assets/Payday-Loan.gif'
import '../component styles/App.css'
import { FaBell, FaRegClock, FaHandHoldingUsd} from 'react-icons/fa';
import { Link } from "react-router-dom";


//main page , still unfinished , if you want add some images and texts like welcom and...

function App() {

  return (
    <div className='home overflow-hidden'>
      <div className='row d-flex justify-content-around text-black intro'>
        <div className='col-md-5 order-md-1 order-2 col-8 text-start text-md-start text-center' style={{fontSize:"25px"}}>
          <h1 className='mb-3 home-title'>Loan System</h1>
          <p style={{fontSize:"20px", letterSpacing:'3px', color:"green"}}> An efficient and user-friendly application </p>
          <p>Manage and organize your loans and debts with us and you will never be late! </p>
          <Link to={"/signIn"} className='mt-5 btn btn-outline-danger fs-5 buttonHome'>Start Managing</Link>
        </div>
        <div className='order-md-2 order-1 col-md-5 col-8  p-0'>
          <img className='imgHome' src={teleg}></img>
        </div>
      </div>

    <div className='container'>
      <div className='row justify-content-around'>
        <div className='col-md-3 col-12 m-3 justify-content-center d-flex'>
          <div className='card h-100 text-center border-0 shadow-sm rounded m-0' style={{ background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' }}>
            <div className='card-body'>
              <FaHandHoldingUsd size={50} color='#fff' className='mb-4' />
              <p className='card-text text-white fw-bold fs-5'>
                Have you ever been stressed over not being able to manage your loans? No need, just add them to your account and we will manage it for you!
              </p>
            </div>
          </div>
        </div>
        <div className='col-md-3 col-12 m-3 justify-content-center d-flex'>
          <div className='card h-100 text-center border-0 shadow-sm rounded m-0' style={{ background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' }}>
            <div className='card-body'>
              <FaRegClock size={50} color='#fff' className='mb-4' />
              <p className='card-text text-white fw-bold fs-5'>
                You can also add your debts and we will take care of them for you, no need to stress over remembering their due times!
              </p>
            </div>
          </div>
        </div>
        <div className='col-md-3 col-12 m-3 justify-content-center d-flex'>
          <div className='card h-100 text-center border-0 shadow-sm rounded m-0' style={{ background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' }}>
            <div className='card-body'>
              <FaBell size={50} color='#fff' className='mb-4' />
              <p className='card-text text-white fw-bold fs-5'>
                We will send you notifications whenever the due time of a debt or a loan is close!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    </div>
    )
}

export default App;



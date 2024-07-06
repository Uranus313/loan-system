import InputPopUp from "./InputPopUp";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import teleg from '../assets/Payday-Loan.gif'
import '../component styles/App.css'
import { useState } from 'react'
// import './App.css'


//main page , still unfinished , if you want add some images and texts like welcom and...

function App() {

  return (
    <div className='home overflow-hidden'>
      <div className='row d-flex justify-content-around text-black intro'>
        <div className='col-md-5 order-md-1 order-2 col-8 text-start text-md-start text-center' style={{fontSize:"25px"}}>
          <h1 className='mb-3 home-title'>Loan System</h1>
          <p style={{fontSize:"20px", letterSpacing:'3px', color:"green"}}> An efficient and user-friendly application </p>
          <p>Manage and organize your loans and debts with us and you will never be late! </p>
          <button className='mt-5 btn btn-outline-danger fs-5 buttonHome'>Start Managing</button>
        </div>
        <div className='order-md-2 order-1 col-md-5 col-8  p-0'>
          <img className='imgHome' src={teleg}></img>
        </div>
      </div>

      <div className={'justify-content-center row gap-lg-5'}>
        <div className="card col-md-2 col-12">
            <div className="card-body">
              <p className="card-text fw-bold fs-4">
                Have you ever been stressed over not being able to manage your loans? no need, just add them to your
                account and we will manage it for you!
              </p>
            </div>
        </div>
        <div className="card col-md-2 col-12">
            <div className="card-body">
              <p className="card-text fw-bold fs-4">
                You can also add you debts and we will take of them for you, no need to stress over remembering their
                due times!
              </p>
            </div>
        </div>
        <div className="card col-md-2 col-12">
            <div className="card-body">
              <p className="card-text fw-bold fs-4">
                We will send you notifications whenever the due time of a debt or a loan is close!
              </p>
            </div>
        </div>
      </div>

    </div>
    )
}

export default App;



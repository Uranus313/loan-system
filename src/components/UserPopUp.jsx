import { useState } from "react";
import { Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import useGetUserLoans from "../hooks/useGetUserLoans";
import LoanRow from "./LoanRow";
import Loading from "./Loading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "../connections/APIClient";
import NotificationMakePopUp from "./NotificationMakePopUp";
function UserPopUp({ user }) {
  let [modalShow, setModalShow] = useState(false);
  let [remainingLoansShow, SetRemainingLoansShow] = useState(false);
  let [paidLoansShow, SetPaidLoansShow] = useState(false);
  let navigate = useNavigate();
  let { data: loans, error: fetchError, isLoading } = useGetUserLoans(user.user_id);
  let apiClient = new APIClient("/admin/admin/"+user.user_id);
  let apiClient2 = new APIClient("/admin/user/"+user.user_id);
  let queryClient = useQueryClient();
  const deleteUser = useMutation({
        mutationFn: (notification) => apiClient2.delWithToken(notification),
        onSuccess: (res ) => {
            queryClient.invalidateQueries(["userList"]);
            // navigate("/");
        },
        onError: (error) =>{
            console.log(error)
            console.log(error.response?.data.detail)
        }
    });
  const demoteAdmin = useMutation({
        mutationFn: (notification) => apiClient.delWithToken(notification),
        onSuccess: (res ) => {
            queryClient.invalidateQueries(["userList"]);
            // navigate("/");
        },
        onError: (error) =>{
            console.log(error)
            console.log(error.response?.data.detail)
        }
    });  
    const promoteAdmin = useMutation({
        mutationFn: (notification) => apiClient.postWithToken(notification),
        onSuccess: (res ) => {
            queryClient.invalidateQueries(["userList"]);
            // navigate("/");
        },
        onError: (error) =>{
            console.log(error)
            console.log(error.response?.data.detail)
        }
    });  
  let counter = 0;
  return (
    <>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        See More
      </Button>
      <Modal
        size="lg"
        show={modalShow}
        onHide={() => setModalShow(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {user.username}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <p>{user.user_id}</p>
          <p>
            {user.firstName}
            {user.middleName && " " + user.middleName}
            {" " + user.lastName}
          </p>
          <p>{user.email}</p>
          <p>{user.dateOfBirth}</p>
          <p>{user.IDNumber}</p>
          {isLoading && <Loading />}
          {loans && !fetchError && <div className="d-flex flex-column ">
              <Button
                variant="primary"
                className="text-white"
                onClick={
                  remainingLoansShow
                    ? () => SetRemainingLoansShow(false)
                    : () => SetRemainingLoansShow(true)
                }
              >
                {remainingLoansShow
                  ? "hide remaining Loans"
                  : "show remaining Loans"}
              </Button>
              <div className={remainingLoansShow ? "d-block overflow-x-scroll" : "d-none"}>
                <h4>Remaining Loans</h4>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Loan id</th>
                      <th>Bank Name</th>
                      <th>Bank Type</th>
                      <th>Amount</th>
                      <th>Interest</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Paid Debts</th>
                      <th>Total Debts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.map((loan, index) => {
                      if (loan.debtNumber > loan.paidDebtNumber) {
                        counter++;
                        let temp = counter;
                        if (index == loans.length) {
                          counter = 0;
                        }
                        return <LoanRow loan={loan} index={temp} key={index} />;
                      } else {
                        if (index == loans.length) {
                          counter = 0;
                        }
                      }
                    })}
                  </tbody>
                </Table>
              </div>
              <hr />

              <Button
                variant="primary"
                className="text-white"
                onClick={
                  paidLoansShow
                    ? () => SetPaidLoansShow(false)
                    : () => SetPaidLoansShow(true)
                }
              >
                {paidLoansShow ? "hide paid Loans" : "show paid Loans"}
              </Button>
              <div className={paidLoansShow ? "d-block overflow-x-scroll" : "d-none"}>
                <h4>Paid Loans</h4>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Loan id</th>
                      <th>Bank Name</th>
                      <th>Bank Type</th>
                      <th>Amount</th>
                      <th>Interest</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Paid Debts</th>
                      <th>Total Debts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.map((loan, index) => {
                      if (loan.debtNumber <= loan.paidDebtNumber) {
                        counter++;
                        let temp = counter;
                        if (index == loans.length) {
                          counter = 0;
                        }
                        return <LoanRow loan={loan} index={temp} key={index} />;
                      } else {
                        if (index == loans.length) {
                          counter = 0;
                        }
                      }
                    })}
                  </tbody>
                </Table>
              </div>
            </div>}
        </Modal.Body>
        <Modal.Footer>
          {user.isAdmin? <Button onClick={() => demoteAdmin.mutate()}>Demote admin</Button>:<Button onClick={() => promoteAdmin.mutate()}>Promote admin</Button>}
          <Button onClick={() => deleteUser.mutate()} variant="danger" disabled={user.isAdmin}>Delete User</Button>
          <Button onClick={() => setModalShow(false)}>Close</Button>
          <NotificationMakePopUp user={user} />          
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default UserPopUp;

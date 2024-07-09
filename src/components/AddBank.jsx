import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { Button } from "react-bootstrap";
import APIClient from "../connections/APIClient";
import { ToastContainer,toast } from "react-toastify";

function AddBank(){
    const nameRef = useRef();
    const apiClient = new APIClient('/admin/bank'); 
    const addBank = useMutation({
        mutationFn: (bank) => {  
            console.log(bank);
            return apiClient.postWithToken(bank)},
        onSuccess: (res ) => {
            console.log(res.data);
            queryClient.invalidateQueries(["loan"]);

            // navigate("/");
        },
        onError: (error) =>{
            console.log(error)
            console.log(error.response?.data.detail)
        }
    });
    function handleSubmit(event){
        event.preventDefault();
        if(nameRef.current.value.trim() == ''){

        }
        addBank
    }
    return(
        <form action="" onSubmit={(event) => handleSubmit(event)}>
            <p>bank</p>
            <input type="text" ref={nameRef} placeholder="bank name"  />
            <Button type="submit">Submit</Button>
        </form>
    )
    
}
export default AddBank;
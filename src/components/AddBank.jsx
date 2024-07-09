import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Button } from "react-bootstrap";
import APIClient from "../connections/APIClient";
import { ToastContainer,toast } from "react-toastify";

function AddBank(){
    const nameRef = useRef();
    const apiClient = new APIClient('/admin/bank'); 
    let queryClient = useQueryClient();
    const addBank = useMutation({
        mutationFn: (bank) => {  
            console.log(bank);
            return apiClient.postWithToken(bank)},
        onSuccess: (res ) => {
            console.log(res.data);
            queryClient.invalidateQueries(["bank"]);
            toast("your loan successfully added",{onOpen: () => {setFormFunction(false)}, onClose: () => navigate("/user/panel"), type: 'success',autoClose: 500,pauseOnHover: false});
            // navigate("/");
        },
        onError: (error) =>{
            console.log(error)
            console.log(error.response?.data.detail);
            Array.isArray(error.response?.data.detail)?  error.response?.data.detail.map((item,index) => {toast(item.msg.includes("Value error,")?item.msg.replace("Value error, ",''): capitalizeFirstLetter(item.loc[item.loc.length-1]) + " " + item.msg.substr(item.msg.indexOf(" ")+1),{type: "error"})}) : toast(error.response?.data.detail ,{type: "error"})
        }
    });
    function handleSubmit(event){
        event.preventDefault();
        if(nameRef.current.value.trim() == ''){
            toast("name can't be empty",{type: "error"});
            return;
        }
        addBank.mutate({name: nameRef.current.value.trim()});
    }
    return(
        <form action="" onSubmit={(event) => handleSubmit(event)}>
            <ToastContainer />
            <p>bank</p>
            <input type="text" ref={nameRef} placeholder="bank name"  />
            <Button type="submit">Submit</Button>
        </form>
    )
    
}
export default AddBank;
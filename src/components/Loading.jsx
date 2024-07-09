import { Spinner } from "react-bootstrap";
import { ToastContainer,toast } from "react-toastify";

function Loading(){
    return(
        <div>
            Loading
            <Spinner />
        </div>
    )
}

export default Loading;
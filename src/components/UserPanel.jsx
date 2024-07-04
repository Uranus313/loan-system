import context from "react-bootstrap/esm/AccordionContext";
import { useOutletContext } from "react-router-dom";

function UserPanel(){
    let context = useOutletContext();
    return(
        <div>
            Welcome {context.user.firstName}
        </div>
    )
}
export default UserPanel;
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import App from "../components/App";
import SignUp from "../components/SignUp";
import VerifyingEmail from "../components/VerifyingEmail";
import SignIn from "../components/SignIn";
import EditProfile from "../components/EditProfile";
import AddLoan from "../components/AddLoan";
import ProfileInfo from "../components/ProfileInfo";
const router = createBrowserRouter([
    {path: '/', element:<Layout /> ,children:[
        {path: '', element:<App />},
        {path:'signUp',element: <SignUp/>},
        {path:'verifyingEmail',element: <VerifyingEmail />},
        {path:'signIn',element: <SignIn />},
        {path:'editProfile',element: <EditProfile />},
        {path:'addLoan',element: <AddLoan />},
        {path:'profileInfo',element: <ProfileInfo />}

    ]}
])

export default router;
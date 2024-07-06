import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import App from "../components/App";
import SignUp from "../components/SignUp";
import VerifyingEmail from "../components/VerifyingEmail";
import SignIn from "../components/SignIn";
import EditProfile from "../components/EditProfile";
import AddLoan from "../components/AddLoan";
import ProfileInfo from "../components/ProfileInfo";
import PrivateLayout from "../components/PrivateLayout";
import MyLoans from "../components/MyLoans";
import UserPanel from "../components/UserPanel";
import SubmitPayment from "../components/SubmitPayment";
import NotificationsPage from "../components/NotificationsPage";
const router = createBrowserRouter([
    {path: '/', element:<Layout /> ,children:[
        {path: '', element:<App />},
        {path:'signUp',element: <SignUp/>},
        {path:'verifyingEmail',element: <VerifyingEmail />},
        {path:'signIn',element: <SignIn />},
        {path: 'user/' , element: <PrivateLayout /> , children:[
            {path:'editProfile',element: <EditProfile />},
            {path:'addLoan',element: <AddLoan />},
            {path:'profileInfo',element: <ProfileInfo />},
            {path:'myLoans',element:<MyLoans />},
            {path:'panel',element:<UserPanel />},
            {path:'addPayment',element:<SubmitPayment />},
            {path:'notifications',element:<NotificationsPage />}

        ]}
        

    ]}
])

export default router;
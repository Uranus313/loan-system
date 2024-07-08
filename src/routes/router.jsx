import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import App from "../components/App";
import SignUp from "../components/SignUp";
import SignIn from "../components/SignIn";
import EditProfile from "../components/EditProfile";
import AddLoan from "../components/AddLoan";
import ProfileInfo from "../components/ProfileInfo";
import PrivateLayout from "../components/PrivateLayout";
import MyLoans from "../components/MyLoans";
import UserPanel from "../components/UserPanel";
import SubmitPayment from "../components/SubmitPayment";
import NotificationsPage from "../components/NotificationsPage";
import AllUsers from "../components/AllUsers";
import PrivateAdminLayout from "../components/PrivateAdminLayout";
import AllLoans from "../components/AllLoans";
const router = createBrowserRouter([
    {path: '/', element:<Layout /> ,children:[
        {path: '', element:<App />},
        {path:'signUp',element: <SignUp/>},
        {path:'signIn',element: <SignIn />},
        {path: 'user/' , element: <PrivateLayout /> , children:[
            {path:'editProfile',element: <EditProfile />},
            {path:'addLoan',element: <AddLoan />},
            {path:'profileInfo',element: <ProfileInfo />},
            {path:'myLoans',element:<MyLoans />},
            {path:'panel',element:<UserPanel />},
            {path:'addPayment',element:<SubmitPayment />},
            {path:'notifications',element:<NotificationsPage />}

        ]},
        {path: 'admin/',element: <PrivateAdminLayout />, children: [
            {path:'allUsers',element:<AllUsers />},
            {path: "allLoans",element:<AllLoans />}
        ]}
        

    ]}
])

export default router;
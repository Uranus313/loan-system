import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import App from "../components/App";
import SignUp from "../components/SignUp";
import VerifyingEmail from "../components/VerifyingEmail";
import SignIn from "../components/SignIn";
const router = createBrowserRouter([
    {path: '/', element:<Layout /> ,children:[
        {path: '', element:<App />},
        {path:'signUp',element: <SignUp/>},
        {path:'verifyingEmail',element: <VerifyingEmail />},
        {path:'signIn',element: <SignIn />}
    ]}
])

export default router;
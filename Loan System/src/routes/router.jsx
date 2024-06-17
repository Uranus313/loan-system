import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import App from "../components/App";
import SignUp from "../components/SignUp";

const router = createBrowserRouter([
    {path: '/', element:<Layout /> ,children:[
        {path: '', element:<App />},
        {path:'signUp',element: <SignUp/>}
    ]}
])

export default router;
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "../pages/Register";
import CheckEmail from "../pages/CheckEmail";
import CheckPassword from "../pages/CheckPassword";
import Home from "../pages/Home";
import Message from "../components/Message";
import AuthLayout from "../layout";
import ForgetPassword from "../pages/ForgetPassword";

// Learning git

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: 'register',
                element: <AuthLayout><Register/></AuthLayout>
            },
            {
                path: 'email',
                element:<AuthLayout><CheckEmail/></AuthLayout>
            },
            {
                path: 'password',
                element: <AuthLayout><CheckPassword /></AuthLayout>
            },
            {
                path:'forget-password',
                element:<AuthLayout><ForgetPassword/></AuthLayout>
            },
            {
                path: '/',
                element: <Home />,
                children: [
                    {
                        path: ':userId',
                        element: <Message />
                    }
                ]
            }
        ]
    }
]);

export default router;

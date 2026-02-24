import SingIn from '@/pages/SingIn';
import SignUp from '@/pages/SignUp';
import { createBrowserRouter } from 'react-router-dom';
import App from '@/App';
import ProtectedRoute from './ProtectedRoute';

const AppRouter = createBrowserRouter([
    //public route
    {
        path:"/signin",element:<SingIn/>
    },
    {
        path:"/signup",element:<SignUp/>
    },
    //private route
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: '/',
                element: <App />
            }
        ]
    }
])



export default AppRouter
import { createBrowserRouter, Outlet } from "react-router-dom";
import ProtectedRoute from "../components/layout/ProtectedRoute";

const publicRoutes=[
  {
    path: "/",
    element: <>AppLayout Component</>,
    children: [
      {
        index: true,
        element: <>Home Page</>,
      },
      {
        path: "about-us",
        element: <>About Us</>,
      },
      {
        path: "contact",
        element: <>About Us</>,
      },
      {
        path: "login",
        element: <>Login Page</>,
      },
      {
        path:"sign-up",
        element:<>Sign Up</>
    }
    ],
  },
]

const candidateRoutes = [
    {
        path:"/dashboard",
        element:<ProtectedRoute roleAllowed={"candidate"} children={<Outlet/>}/>,
        children:[{
            index:true,
            element:<>Candidate Dashboard</>
        }]
    }
]

const companyRoutes = [
    {
        path:"/company/dashboard",
        element:<><ProtectedRoute roleAllowed={"company"} children={<Outlet/>}/></>,
        children:[{
            index:true,
            element:<>Company Dashboard</>
        }]
    }
]

const interviewerRoutes = [
    {
        path:"/interviewer/dashboard",
        element:<ProtectedRoute roleAllowed={"interviewer"} children={<>hello</>}/>,
        children:[{
            index:true,
            element:<>Interviwer Dashboard</>
        }]
    }
]



export const router = createBrowserRouter([
  ...publicRoutes,
  ...candidateRoutes,
  ...interviewerRoutes,
  ...companyRoutes,
  {
    path:"*",
    element:<>404 Not Found</>
  }
]);

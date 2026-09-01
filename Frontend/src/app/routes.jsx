import { createBrowserRouter, Outlet } from "react-router-dom";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";
import Login from "../pages/Auth/Login";
import SignUp from "../pages/Auth/SignUp";
import Home from "../pages/Home/Home";
import About from "../pages/Home/About";
import Dashboard from "../pages/Candidate/Dashboard";
import DashboardOverview from "../pages/Candidate/DashboardOverview";
import JobsSectionPage from "../pages/Candidate/JobsSection";
import ApplicationsPage from "../pages/Candidate/ApplicationsPage";
import InterviewsPage from "../pages/Candidate/InterviewsPage";
import InterviewerDashboard from "../pages/interviewer/InterviewerDashboard";
import OrganizationDashboard from "../pages/organization/OrganizationDashboard";
import EnvironmentLayout from "../environment/EnvironmentLayout";
import InterviewLayout from "../environment/layout/InterviewLayout";
import InterviewDetails from "../environment/pages/InterviewDetails";
import Lobby from "../environment/pages/Lobby";

// Placeholders for unimplemented components to prevent routing ReferenceErrors
const Workspace = () => <div className="min-h-screen bg-[#07070b] text-neutral-400 flex items-center justify-center">Workspace (Coming Soon)</div>;




const publicRoutes = [
  {
    path: "/",
    element: <><AppLayout /></>,
    children: [
      {
        index: true,
        element: <><Home /></>,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "about-us",
        element: <About />,
      },
    ],
  },
  {
    path: "/login",
    element: <><Login /></>,
  },
  {
    path: "/sign-up",
    element: <><SignUp /></>,
  },
]

const candidateRoutes = [
  {
    path: "/dashboard",
    element: <ProtectedRoute roleAllowed={"candidate"} children={<Outlet />} />,
    children: [
      {
        element: <Dashboard />,
        children: [
          { index: true, element: <DashboardOverview /> },
          { path: "jobs", element: <JobsSectionPage /> },
          { path: "applications", element: <ApplicationsPage /> },
          { path: "interviews", element: <InterviewsPage /> },
        ]
      }
    ]
  }
]

const companyRoutes = [

  {
    path: "/organization",
    element: <ProtectedRoute roleAllowed={"ORGANIZATION"} children={<Outlet />} />,
    children: [
      { index: true, element: <OrganizationDashboard /> },
      { path: "dashboard", element: <OrganizationDashboard /> },
      { path: "jobs", element: <OrganizationDashboard /> },
      { path: "applications", element: <OrganizationDashboard /> },
      { path: "interviews", element: <OrganizationDashboard /> },
      { path: "candidates", element: <OrganizationDashboard /> },
    ],
  },
];

import InterviewEnded from "../environment/pages/InterviewEnded";

const InterviewEnvironment = [
  {

    path: "/interview/:interviewId",

    element: <InterviewLayout />,

    children: [

      {
        index: true,
        element: <InterviewDetails />
      },

      {
        path: "room",
        element: <Lobby />
      },


      {
        path: "workspace",
        element: <EnvironmentLayout />
      },

      {
        path: "ended",
        element: <InterviewEnded />
      }

    ]

  },
  {
    path: "/interview-ended",
    element: <InterviewEnded />
  }
]


const interviewerRoutes = [

  {
    path: "/interviewer",
    element: <ProtectedRoute roleAllowed={"INTERVIEWER"} children={<Outlet />} />,
    children: [
      { index: true, element: <InterviewerDashboard /> },
      { path: "dashboard", element: <InterviewerDashboard /> },
      { path: "interviews", element: <InterviewerDashboard /> },
      { path: "settings", element: <InterviewerDashboard /> },
    ],
  },
];




export const router = createBrowserRouter([
  ...publicRoutes,
  ...candidateRoutes,
  ...interviewerRoutes,
  ...companyRoutes,
  ...InterviewEnvironment,
  {
    path: "*",
    element: <>404 Not Found</>
  }
]);

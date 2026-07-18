import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import { useEffect } from "react";

const ProtectedRoute = ({roleAllowed,children}) => {
  const {user,roleRoute} = useUserStore();
  const navigate = useNavigate();
    useEffect(() => {
    if(user?.role!=roleAllowed){
        navigate(roleRoute[user?.role] || "/")
    }
  },[]);
  return children;
};

export default ProtectedRoute;

import { useMutation } from "@tanstack/react-query";
import { LoginHandler, signupHandler } from "../AuthFunction/auth.function";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../store/userStore";
import { Toaster } from "../../../components/ui/Toaster";
import toast from "react-hot-toast";

export const useAuthHook = () => {
  const navigate = useNavigate();
  const { roleRoute, setUser, setAccessToken } = useUserStore();

  const { mutate: login, isPending: isLoginPending } = useMutation({
    mutationFn: (data) => LoginHandler(data),
    onSuccess: (data) => {
      if (data.success) {
        setUser(data.data.user);
        setAccessToken(data.data.accessToken);
        navigate(roleRoute[data.data.user.role]);
        toast.success(data.message);
      }
    },
    onError:(err)=>{
        toast.error(err.response.data.message)
        
    }
  });

  const { mutate: signUp, isPending: isSignUpPending } = useMutation({
    mutationFn: (data) => signupHandler(data),
    onSuccess: (data) => {
      if (data.success) {
        navigate("/login");
        toast.success(data.message);
      }
    },
    onError:(err)=>{
        toast.error(err.response.data.message)
        
    }
  });

  return { login, signUp, isLoginPending, isSignUpPending };
};

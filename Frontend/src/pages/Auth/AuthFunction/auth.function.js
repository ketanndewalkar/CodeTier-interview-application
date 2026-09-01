import { api } from "../../../services/api/axiosInstance"

export const LoginHandler = async (data) =>{
    try {
        const result = await api.post("/auth/login",data);
        return result.data;
    } catch (error) {
        throw error;
    }
}

export const signupHandler = async (data) =>{
    try {
        const res = await api.post("/auth/signup",data)
        return res.data;
    } catch (error) {
        throw error;
        
    }
}
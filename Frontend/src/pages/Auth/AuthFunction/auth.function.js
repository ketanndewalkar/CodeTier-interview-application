import { api } from "../../../services/api/axiosInstance"

export const LoginHandler = async (data) =>{
    try {
        const result = await api.post("/auth/login",data);
        console.log(result.data);
        return result.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const signupHandler = async (data) =>{
    try {
        console.log("asd")
        const res = await api.post("/auth/signup",data)
        console.log(res);
        return res.data;
    } catch (error) {
        throw error;
        
    }
}
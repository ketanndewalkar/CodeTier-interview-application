import axios from "axios"

export const api = axios.create({
    baseURL:VITE_BACKEND_URL,
    withCredentials:true
})


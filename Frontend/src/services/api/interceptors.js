import { api } from "./axiosInstance";

api.interceptors.request.use((req)=>{
    return req;
}
,(error)=>{
    return Promise.reject(error);
})

api.interceptors.response.use((res)=>{
    return res;
},(error)=>{
    return Promise.resolve(error)
})
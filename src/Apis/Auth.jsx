import axios from "axios";
const apiUrl= import.meta.env.VITE_BACKEND_URL

export const register=async ({name,email,password})=>{
    try {
        const response= await axios.post(`${apiUrl}/auth/register`,{name,email,password})
        return response
    } catch (error) {
        console.log(error)
        return error.response.data
    }
}

export const login=async ({email,password})=>{
    try {
        const response= await axios.post(`${apiUrl}/auth/login`,{email,password})
        if(response.data.token){
            document.cookie = `email=${email}; path=/`;
            document.cookie = `token=${response.data.token}; path=/`;
        }
        return response
    } catch (error) {
        console.log(error)
    }
}
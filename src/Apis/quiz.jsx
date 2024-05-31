import axios from "axios";
const apiUrl=__API_URL__
import Cookies from 'js-cookie';

export const createQuiz=async ({email,quizName,quizType,questionNo,question,option,option1,optionNo,optionType,timer,impression,correctOption,correctAns,wrongAns,anaylsis})=>{
    try {
        const token=Cookies.get('token')
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response= await axios.post(`${apiUrl}/quiz/createQuiz`,{email,quizName,quizType,questionNo,question,option,option1,optionNo,optionType,timer,impression,correctOption,correctAns,wrongAns,anaylsis})
        return response
    } catch (error) {
        console.log(error)
        
    }
}

export const quizById= async (id)=>{
    try {
        const response= axios.get(`${apiUrl}/quiz/getQuiz/${id}`)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const updateQuiz=({email,quizName,quizType,questionNo,question,option,option1,optionNo,optionType,timer,impression,correctOption,correctAns,wrongAns,anaylsis},id)=>{
    try {
        const response=axios.put(`${apiUrl}/quiz/editQuiz/${id}`,{email,quizName,quizType,questionNo,question,option,option1,optionNo,optionType,timer,impression,correctOption,correctAns,wrongAns,anaylsis})
        return response
    } catch (error) {
        console.log(error)
    }
}

export const allQuiz=async ()=>{
    try {
        const token=Cookies.get('token')
        const email=Cookies.get('email')
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response= await axios.get(`${apiUrl}/quiz/allQuiz/${email}`)
        
        return response
    } catch (error) {
        console.log(error)
    }
}

export const deleteQuiz=async (id)=>{
    try {
        const token=Cookies.get('token')
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response= await axios.delete(`${apiUrl}/quiz/deleteQuiz/${id}`)
        return response
    } catch (error) {
        console.log(error)
    }
}
export const trendingQuiz= async()=>{
    try {
        const token=Cookies.get('token')
        const email=Cookies.get('email')
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response= await axios.get(`${apiUrl}/quiz/trendingQuiz/${email}`)
        return response
    } catch (error) {
        console.log(error)
    }
}

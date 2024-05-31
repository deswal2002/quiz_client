import React, { useEffect, useState } from 'react'
import style from './Homes.module.css'
import line from '../../assets/Image/line.svg'
import Createquiz from '../Createquiz/Createquiz'
import Anaylsis from '../Anaylsis/Anaylsis'
import TrendingQuiz from '../TrendingQuiz/TrendingQuiz'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'

function Homes() {
  const navigate = useNavigate()
  const [box,setbox]=useState([1,0,0])
  const [createQuiz,setcreateQuiz]=useState(false)
  const [anaylsis,setanaylsis]=useState(false)
  
  const logout =()=>{
    Cookies.remove('email')
    Cookies.remove('token')
    navigate('/auth')
  }
  
  return (
    <>
    {createQuiz?<Createquiz box={setbox} closeQuiz={setcreateQuiz}/>:<></>}
    <div style={{display:"flex"}}>
    <div className={style.navbar}>
      <div className={style.quiz}>QUIZZIE</div>
      <div className={style.box}>
        <div className={style.box1} style={{boxShadow:box[0]===1?"0px 0px 14px 0px #0000001F":""}} onClick={()=>(setbox([1,0,0]),setanaylsis(false))}>Dashboard</div>
        <div className={style.box2} style={{boxShadow:box[1]===1?"0px 0px 14px 0px #0000001F":""}} onClick={()=>(setbox([0,1,0]),setanaylsis(true))}>Analytics</div>
        <div className={style.box3} style={{boxShadow:box[2]===1?"0px 0px 14px 0px #0000001F":""}} onClick={()=>(setbox([0,0,1]),setcreateQuiz(true))}>Create Quiz</div>
      </div>
      <div><img className={style.image} src={line}/></div>
      <div className={style.logout} onClick={()=>logout()}>Logout</div>
    </div>
    <div>{anaylsis?<Anaylsis/>:<><TrendingQuiz/></>}</div>
  
    </div>
    </>
  )
}

export default Homes
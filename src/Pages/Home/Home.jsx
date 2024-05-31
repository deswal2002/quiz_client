import React, { useEffect } from 'react'
import Homes from '../../Component/Home/Homes'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'
function Home() {
  const navigate = useNavigate()
  useEffect(()=>{
    const email=Cookies.get('email')
    if(!email){
      navigate('/auth')
    }
  },[])
  
  return (
    <div><Homes/></div>
  )
}

export default Home
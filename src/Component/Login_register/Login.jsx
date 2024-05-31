import React,{useEffect, useState} from 'react'
import style from './Login.module.css'
import { register,login } from '../../Apis/Auth'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'

const notify = (word) => toast.error(word);
const registers=() => toast.success('user register successfull')

function Login() {
    const navigate = useNavigate()
    const [logRes,setlogRes]=useState(false)
    const [form,setform] = useState({
        name:"",
        email:"",
        password:"",
        confirmPassword:""
    })
    const [error,seterror]=useState({
        name:"",
        email:"",
        password:"",
        confirmPassword:""
    })
    const listion=(e)=>{
        seterror({...error,[e.target.name]:""})
        setform({...form,[e.target.name]:e.target.value})
    }
    const submit=async ()=>{
        if(logRes){
            const errors={
                name:"",
                email:"",
                password:"",
                confirmPassword:""
            }
            if(form.name===""){
                errors.name="Enter the Name"
            }
            if(form.email===""){
                errors.email="Enter the email"
            }
            if(form.password===""){
                errors.password="Enter the password"
            }
            if(form.confirmPassword===""){
                errors.confirmPassword="Enter the password"
            }
            if(form.password!==form.confirmPassword){
                notify("password doesn't match")
                errors.confirmPassword="password doesn't match"
            }
            
            seterror(errors)
            if(form.name!=="" && form.email!=="" && form.password!=="" && form.confirmPassword!=="" && errors.confirmPassword===""){
                const response= await register({name:form.name,email:form.email,password:form.password})
                
                if(response.errorMeassage==='User already exist'){
                    notify(response.errorMeassage)
                }

                if(response.data.message==='user register successfull'){
                    registers()
                    setlogRes(false) 
                    setform({
                        ...form,
                        name:"",
                        email:"",
                        password:"",
                        confirmPassword:""
                    })
                }
            }
        }else{
            const errors={
                name:"",
                email:"",
                password:"",
                confirmPassword:""
            }
            if(form.email===""){
                errors.email="Enter the email"
            }
            if(form.password===""){
                errors.password="Enter the password"
            }
            seterror(errors)
            if(form.email!=="" && form.password!==""){  
                const response = await login({email:form.email,password:form.password})
                console.log(response)
                if(response.data.errorMeassage){
                    notify(response.data.errorMeassage)
                }else{
                    navigate('/')
                }
            }
        }
    }
    
  return (
    <div className={style.b}>
        <div className={style.box}>
            <div className={style.quizz}>QUIZZIE</div>
            <div className={style.sign}>
                <button className={style.button1} style={{backgroundColor:logRes? "#FFFFFF":"",boxShadow:logRes?"0px 0px 50px 0px #0019FF3D":""}} onClick={()=>(setlogRes(true),setform({...form,name:"",email:"",password:"",confirmPassword:""}))}>Sign Up</button>
                <button className={style.button2} style={{backgroundColor:logRes?"":"#FFFFFF", boxShadow:logRes?"":"0px 0px 50px 0px #0019FF3D"}} onClick={()=>(setlogRes(false) ,setform({...form,name:"",email:"",password:"",confirmPassword:""}))}>Log In</button>
            </div>
            {logRes ?
            <div className={style.text}>
                <div className={style.text1}>
                    <div className={style.label}>Name</div>
                    <div className={style.label1}>Email</div>
                    <div className={style.label2}>Password</div>
                    <div className={style.label3}>Confirm Password</div>
                </div>
                <div className={style.input}>
                    <div><input type='text' className={error.name===""?style.in:style.in_new} name='name' onChange={(e)=>listion(e)} value={form.name} placeholder={error.name===""?"":error.name} /></div>
                    <div><input type='email' className={error.email===""?style.in1:style.in_new1} onChange={(e)=>listion(e)} name='email' value={form.email} placeholder={error.email===""?"":error.email}/></div>
                    <div><input type='password' name='password' onChange={(e)=>listion(e)} className={error.password===""?style.in2:style.in_new2} value={style.password} placeholder={error.password===""?"":error.password}/></div>
                    <div><input type='password' name='confirmPassword' onChange={(e)=>listion(e)} className={error.confirmPassword===""?style.in3:style.in_new3} value={style.confirmPassword} placeholder={error.confirmPassword===""?"":error.confirmPassword}/></div>
                </div>
            </div>
            :
            <div className={style.text}>
                <div className={style.text1}>
                    <div className={style.label1}>Email</div>
                    <div className={style.label2} style={{marginTop:"15%"}} >Password</div>
                </div>
                <div className={style.input}>
                    <div><input type='email' onChange={(e)=>listion(e)} name="email" className={error.email===""?style.in1:style.in_new1} value={form.email} placeholder={error.email===""?"":error.email}/></div>
                    <div><input type='password' onChange={(e)=>listion(e)} name='password' className={error.password===""?style.in2:style.in_new2} style={{marginTop:"12%"}} value={form.password} placeholder={error.password===""?"":error.password}/></div>
                </div>
            </div>
            
            }
            <div className={style.signin} onClick={()=>submit()}>{logRes?"Sign-Up":"Log In"}</div>
        </div>
        <Toaster />
    </div>
  )
}

export default Login
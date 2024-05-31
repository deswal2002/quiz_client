import React, { useEffect, useState } from 'react'
import { allQuiz, deleteQuiz } from '../../Apis/quiz'
import style from './Anaylsis.module.css'
import share from '../../assets/Image/share.svg'
import edit from '../../assets/Image/edit.svg'
import delete1 from  '../../assets/Image/delete1.svg'
import Createquiz from '../Createquiz/Createquiz'
import { useDispatch } from 'react-redux';
import { update } from '../../FileSlice'
import toast, { Toaster } from 'react-hot-toast';
const copy = () => toast.success('Link copied to Clipboard',{position:'top-right'});
const Quizdelete = () => toast.success('Quiz is Deleted Successfull');

function Anaylsis() {
    const [allQuizs,setallQuizs]=useState([])
    const [wiseAnalysis,setwiseAnalysis] = useState(false)
    const [object,setobject]=useState([])
    const [id,setid] =useState("")
    const [Delete,setDelete]= useState(false)
    const [editQuiz,seteditQuiz]=useState(false)
    const dispatch = useDispatch()

    useEffect( ()=>{
        const run=async ()=>{
            try {
                const response=await allQuiz()
                setallQuizs(response.data.data)
            } catch (error) {
                console.log(error)
            }
        }
        run()
    },[Delete,editQuiz])
    
    const deleteOneQuiz=async (id)=>{
        try {
            const response=await deleteQuiz(id)
            if(response.data.message==='Quiz deleted  successfull'){
                Quizdelete()
            }
            setDelete(false)
        } catch (error) {
            console.log(error)
        }
    }
    const createAt=(create)=>{
        const month=['Jan.','Feb.','March','April','May','June','July','Aug.','Sept.','Oct.','Nov.','Dec.']
        return create.substring(8,10)+" "+month[create.substring(6,7)-1]+" "+create.substring(0,4)
    }
    const formatNumber=(number)=> {
        if (number >= 10000) {
            return Math.floor(number / 1000) + 'k';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'k';
        } else {
            return number;
        }
    }

  return (
    <>
    {editQuiz?<><Createquiz offEdit={seteditQuiz}/></>:<></>}
    {Delete?<>
    <div className={style.deleteQuiz}>
        <div className={style.white}>
            <div className={style.deleteText}>Are you confirm you </div>
            <div className={style.deleteText1}>want to delete ?</div>
            <div className={style.deletecancel}>
                <div className={style.delete2} onClick={()=> (deleteOneQuiz(id))}>Confirm Delete</div>
                <div className={style.cancel1} onClick={()=> setDelete(false)}>Cancel</div>
            </div>
        </div>
    </div>
    </>:<></>}
    {wiseAnalysis?<>
    <div className={style.box}>
        <div className={style.box1}>
            <div className={style.quizName}>{object?.quizName} Question Analysis</div>
            <div className={style.time}>
                <div>Created on : {createAt(object?.createdAt)}</div>
                <div>Impressions : {object?.impression}</div>
            </div>
        </div>
        {object?.question.map((obj,index)=>(
            <div className={style.question}>
                <div>Q.{index+1} {obj} ?</div>
                <div>
                    {object?.quizType==="Q & A"?
                    <div className={style.allbox}>
                        <div className={style.ans}>
                            <div className={style.digit}>{object?.correctAns[index]+object?.wrongAns[index]}</div>
                            <div className={style.text}>people Attempted the question</div>
                        </div>
                        <div className={style.ans}>
                            <div className={style.digit}>{object?.correctAns[index]}</div>
                            <div className={style.text}>people Answered Correctly</div>
                        </div>
                        <div className={style.ans}>
                            <div className={style.digit}>{object?.wrongAns[index]}</div>
                            <div className={style.text}>people Answered Incorrectly</div>
                        </div>
                    </div>:
                    <div style={{display:"flex",gap:"4%",marginTop: "2%"}}>
                        {object?.anaylsis[index]?.map((obj,index)=>(
                            <div className={style.option}>
                                <div className={style.digit1}>{obj}</div>
                                <div className={style.text1}>Option {index+1}</div>
                            </div>
                        ))}
                    </div>
                    }
                </div>
                <div className={style.line}><hr></hr></div>
                
            </div>
        ))}
        <div style={{marginTop:"4%"}}></div>
    </div>
    </>:<div className={style.box}>
        <div className={style.quiz}>Quiz Analysis</div>
        <tbody className={style.newbox}>
            <tr className={style.title}>
                <th className={style.write}>S.No</th>
                <th className={style.write123}>Quiz Name</th>
                <th className={style.write}>Created on</th>
                <th className={style.write}>Impression</th>
            </tr>
                {allQuizs?.map((obj,index)=>(
                    <tr className={style.title1} style={{backgroundColor:(index+1)%2===0?"#B3C4FF":"#EDEDED"}}>
                        <td className={style.write1}>{index+1}</td>
                        <td className={style.write12} >{obj?.quizName}</td>
                        <td className={style.write1}>{createAt(obj?.createdAt)}</td>
                        <td className={style.write1}>{formatNumber(obj?.impression)}</td>
                        <div className={style.write1}>
                            <img src={edit} alt="" onClick={()=>(seteditQuiz(true),dispatch(update(obj)))} /><img src={delete1} alt="" onClick={()=>(setDelete(true),setid(obj._id))} style={{marginLeft:"10%"}} /><img src={share} alt="" onClick={() => (navigator.clipboard.writeText(`${window.location.href}quiz/${obj._id}`),copy())} style={{marginLeft:"10%"}}/>
                        </div>
                        <td className={style.write2} onClick={()=>(setwiseAnalysis(true),setobject(obj))}>Question Wise Analysis</td>
                    </tr>
                ))}
        </tbody>   
        <div className={style.down}></div>
    </div>}
    <Toaster  />
    </>
  )
}

export default Anaylsis
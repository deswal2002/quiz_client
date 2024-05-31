import React, { useEffect, useState } from 'react'
import style from './Selectquiz.module.css'
import win from '../../assets/Image/win.png'
import { updateQuiz } from '../../Apis/quiz'
import { useParams } from 'react-router-dom'
import { quizById } from '../../Apis/quiz'
function Selectquiz(props) {
  const { id } = useParams()
  const [nextNo, setnextNo] = useState(0)
  const [select, setselect] = useState([])
  const [submit, setsubmit] = useState(false)
  const [counts, setcounts] = useState(0)
  const [quizs,setquizs]=useState([])

  useEffect(()=>{
    const run =async()=>{
      try {
        const response=await quizById(id)
        setquizs(response.data.data)
        setSeconds(response.data.data.timer)
      } catch (error) {
        console.log(error)
      }
    }
    run()
  },[])

  const [impression, setimpression] = useState(localStorage.getItem('impression'));
  const [seconds, setSeconds] = useState(quizs.timer);
  
  useEffect(() => {
    const newImpression = Number(impression) + 1;
    setimpression(newImpression);
    localStorage.setItem('impression', newImpression);
  }, []);

  useEffect(() => {
    if (seconds > 0  ) {
      const timer = setInterval(() => {
        setSeconds(prevTime => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }else{
      next()
      if(nextNo + 1 < quizs?.questionNo?.length){
        setSeconds(quizs.timer)
      }else{
        setSeconds(0)
      }
      
    }
  }, [seconds]);

  
  const [trues, settrues] = useState(false)

  const next = async () => {
    if (nextNo + 1 < quizs.questionNo.length) {
      setnextNo(nextNo +1)
      setSeconds(quizs.timer)
    } else {
      if (quizs.quizType === "Q & A") {
        setsubmit(true)
        let count = 0
        let wrongAns=quizs.wrongAns
        let correctAns=quizs.correctAns
        
        for (let i = 0; i < select.length; i++) {
          if (select[i] === (quizs?.correctOption[i] - 1)) {
            count += 1
            correctAns=correctAns.map((obj,index)=>index===i?obj+1:obj) 
          }else{
            wrongAns=wrongAns.map((obj,index)=>index===i?obj+1:obj)
          }
        }   
        setcounts(count)
        setsubmit(true)
        const response=await updateQuiz({email:quizs.email,quizName:quizs.quizName,quizType:quizs.quizType,questionNo:quizs.questionNo,question:quizs.question,option:quizs.option,option1:quizs.option1,optionNo:quizs.optionNo,optionType:quizs.optionType,timer:quizs.timer,impression:quizs.impression+impression,correctOption:quizs.correctOption,correctAns:correctAns,wrongAns:wrongAns,anaylsis:quizs.anaylsis},quizs._id)
        console.log(response)
        localStorage.removeItem("impression");
      } else {
        let anaylsis=[...quizs.anaylsis]
        if(select.length!==0){
          for(let i=0;i<select.length;i++){
            anaylsis[i]=anaylsis[i].map((obj,index)=>index===select[i]?obj+1:obj)
          }
         
        }
        
        setsubmit(true)
        const response=await updateQuiz({email:quizs.email,quizName:quizs.quizName,quizType:quizs.quizType,questionNo:quizs.questionNo,question:quizs.question,option:quizs.option,option1:quizs.option1,optionNo:quizs.optionNo,optionType:quizs.optionType,timer:quizs.timer,impression:quizs.impression+impression,correctOption:quizs.correctOption,correctAns:quizs.correctAns,wrongAns:quizs.wrongAns,anaylsis:anaylsis},quizs._id)
        console.log(response)
        localStorage.removeItem("impression");
      }
    }
  }

  const selectOption = (index) => {
    let newselect = select
    newselect[nextNo] = index
    setselect(newselect)
    settrues(true)
  }

  useEffect(() => {
    settrues(false)
  }, [trues])

  
  return (
    <div className={style.black}>
      <div className={style.white}>
        {submit ? <>{quizs?.quizType === "Q & A" ? <><div className={style.congrats}>Congrats Quiz is completed</div>
          <div className={style.win}><img className={style.win1} src={win} /></div>
          <div className={style.score}><div>Your Score is&nbsp;</div><div style={{ color: "#60B84B" }}> 0{counts}/0{quizs?.correctOption?.length}</div></div></>
          : <>
            <div className={style.poll1} >Thank you</div>
            <div className={style.poll}>for participating in</div>
            <div className={style.poll}>the Poll</div>
          </>}

        </> : <>
          <div style={{ display: "flex", flexDirection: "row", marginTop: "2%" }}>
            <div className={style.questionNo}>0{quizs?.questionNo ? quizs.questionNo[nextNo] : ""}/0{quizs?.questionNo?.length}</div>
            {quizs.timer === 0 ? <></> : <div className={style.timer} style={{ display: quizs?.quizType === "Poll Type" ? "none" : "" }}>00:{seconds===10?seconds:'0'+seconds}</div>}
          </div>
          <div className={style.question}>{quizs?.question ? quizs.question[nextNo] : ""} .</div>
          <div className={style.option}>
            {quizs.option ? quizs.option[nextNo].map((obj, index) => (
              <div className={index % 2 !== 0 ?quizs.optionType === 'image'? style.option112:quizs.optionType === 'textimage'?style.option113:style.option11:quizs.optionType === 'image'?style.option12:quizs.optionType === 'textimage'?style.option13:style.option1} style={{  border: select[nextNo] === index ? "3px solid #5076FF" : "", backgroundImage: quizs.optionType === 'image' ? `url(${obj})` : "" }} onClick={() => selectOption(index)}><div className={quizs.optionType === 'textimage' ? style.write : ""} style={{ display: quizs.optionType === 'image' ? "none" : "" }}>{obj}</div><div className={quizs.optionType === 'textimage' ? style.boximage : ""} style={{ backgroundImage: quizs.optionType === "textimage" ? `url(${quizs.option1[nextNo][index]})` : "", display: quizs.optionType !== "textimage" ? "none" : "" }}></div></div>
            )) : ""}
          </div>
          <div className={style.submit}><div onClick={() => next()} className={style.next}>{nextNo + 1 === quizs?.questionNo?.length ? "SUBMIT" : "NEXT"}</div></div>
        </>}

      </div>
    </div>
  )
}

export default Selectquiz
import React, { useEffect, useState } from 'react'
import style from './Createquiz.module.css'
import Cookies from 'js-cookie';
import plus from '../../assets/Image/plus.svg'
import cross from '../../assets/Image/cross.svg'
import deletes from '../../assets/Image/delete.svg'
import { createQuiz,updateQuiz } from '../../Apis/quiz';
import toast, { Toaster } from 'react-hot-toast';
import cross1 from '../../assets/Image/cross1.svg'
import { useSelector,useDispatch } from 'react-redux';
import { Deleteupdate } from '../../FileSlice';
const quizSucess=() => toast.success("quiz create succesfulls")
const updateQuizSucess=() => toast.success("Quiz is update successfull")
const copy = () => toast.success('Link copied to Clipboard',{className:style.copy})
const notify = (word) => toast.error(word);

function Createquiz(props) {
    const dispatch = useDispatch()
    const state=useSelector((state) => state.File_save.QuizId)
    const [next, setnext] = useState(false)
    const [quesNo, setquesNo] = useState(0)
    const [final,setfinal] = useState(false)
    const [id,setid]=useState("")
    const [quiz, setquiz] = useState({
        email: Cookies.get('email'),
        quizName: state?.quizName||"",
        quizType: state?.quizType||"",
        questionNo: state?.questionNo|| [1],
        question:state?.question|| [],
        option:state?.option|| [],
        option1:state?.option1|| [],
        optionNo:state?.optionNo|| [[1, 2]],
        optionType:state?.optionType|| "text",
        timer: state?.timer ||0,
        impression: state?.impression||0,
        correctOption:state?.correctOption|| [],
        correctAns:state?.correctAns|| [0],
        wrongAns:state?.wrongAns || [0],
        anaylsis:state?.anaylsis|| [[0,0]]
    })

    const addInfo = (e) => {
        setquiz({ ...quiz, [e.target.name]: e.target.value })
    }

    const addQuestion = () => {
        const newNo = [...quiz.questionNo]
        const newOP = [...quiz.optionNo]
        let newAnalysis =[...quiz.anaylsis]
        newOP[newOP.length] = [1, 2]
        newAnalysis[newAnalysis.length]=[0,0]
        newNo[newNo.length] = newNo[newNo.length - 1] + 1
        let newcorrect=newNo.map(()=>0)
        let newwrong=newNo.map(()=>0)
        setquiz({ ...quiz, questionNo: newNo, optionNo: newOP ,correctAns:newcorrect,wrongAns:newwrong,anaylsis:newAnalysis})        
    }

    const removeQuestion = () => {
        let newNo = []
        let newOP = []
        let question=[]
        let option=[]
        let option1=[]
        let newanalysis=[]
        for (let i = 0; i < quiz.questionNo.length - 1; i++) {
            newNo[i] = quiz.questionNo[i]
            newOP[i] = quiz.optionNo[i]
            question[i]=quiz.question[i]
            option[i]=quiz.option[i]
            option1[i]=quiz.option1[i]
            newanalysis[i]=quiz.anaylsis[i]
        }
        let newcorrect=newNo.map(()=>0)
        let newwrong=newNo.map(()=>0)
       
        setquiz({ ...quiz, questionNo: newNo, optionNo: newOP ,question:question,option:option ,option1:option1,correctAns:newcorrect,wrongAns:newwrong,anaylsis:newanalysis})
    }

    const selection = (e) => {
        let value = e.target.value
        if (value !== "textimage") {
            setquiz({ ...quiz, optionType: e.target.value, option1: [] })
        } else {
            setquiz({ ...quiz, optionType: e.target.value })
        }
    }

    const addOption = () => {
        let updateOptionNo = [...quiz.optionNo]
        let newupdate=[...updateOptionNo[quesNo]]
        newupdate[newupdate.length]=(newupdate.length)+1
        updateOptionNo[quesNo] = newupdate  
        let newAnalysis = updateOptionNo.map((obj)=>obj.map(()=>0))  
        setquiz({ ...quiz, optionNo: updateOptionNo,anaylsis:newAnalysis }) 
    }

    const removeOption = () => {
        let removeOptionNo = quiz.optionNo
        let news = []
        for (let i = 0; i < removeOptionNo[quesNo].length - 1; i++) {
            news[i] = removeOptionNo[quesNo][i]
        }
        removeOptionNo[quesNo] = news
        let newAnalysis = removeOptionNo.map((obj)=>obj.map(()=>0)) 
        setquiz({ ...quiz, optionNo: removeOptionNo,anaylsis:newAnalysis })
    }

    const continueToNext = () => {
        if(quiz.quizName===""){
            notify('Fill the quiz name')
        }else if(quiz.quizType===""){
            notify('Select the quiz type')
        }else{
            setnext(true)
        }
    }

    const changeText = (e, text, opts) => {
        if (text === 'ques') {
            let quesText = [...quiz.question]
            quesText[quesNo] = e.target.value
            setquiz({ ...quiz, question: quesText })
        } else if (text === 'opt') {
            let optionText = [...quiz.option]
            if (!optionText[quesNo]) {
                let newOptionText=[]
                newOptionText[opts-1]=e.target.value
                optionText[quesNo] = newOptionText
            } else {
                let newOptionText=[...optionText[quesNo]]
                newOptionText[opts-1]=e.target.value
                optionText[quesNo] = newOptionText
            }
            setquiz({ ...quiz, option: optionText })
        } else if (text === 'correct') {
            let correct = [...quiz.correctOption]
            correct[quesNo] = opts
            setquiz({ ...quiz, correctOption: correct })
        } else {
            let optionText = [...quiz.option1]
            if (!optionText[quesNo]) {
                let newOptionText=[]
                newOptionText[opts-1]=e.target.value
                optionText[quesNo] = newOptionText
            } else {
                let newOptionText=[...optionText[quesNo]]
                newOptionText[opts-1]=e.target.value
                optionText[quesNo] = newOptionText
            }
            setquiz({ ...quiz, option1: optionText })
        }
    }

    const creatQuiz = async () => {
        let errors=0
        if (quiz.question.length < quiz.questionNo.length) {
            notify('Fill all the question')
            errors=1
        } else if (quiz.quizType !== 'Poll Type' && quiz.correctOption.length < quiz.questionNo.length) {
            notify('choice the correct option')
            errors=1
        } else if (quiz.option.length < quiz.questionNo.length || (quiz.optionType === 'textimage' && quiz.option1.length < quiz.questionNo.length)) {
            notify('Fill all the option')
            errors=1
        } else {
            for (let i = 0; i < quiz.option.length; i++) {
                if (quiz.option[i].length < quiz.optionNo[i].length) {
                    notify('Fill all the option')
                    errors=1
                } else {
                    quiz.option[i].map((obj) => obj === "" ? (notify('Fill all the option'), errors=1) : "")
                }
            }
            if (quiz.optionType === 'textimage') {
                for (let i = 0; i < quiz.option1.length; i++) {
                    if (quiz.option1[i].length < quiz.optionNo[i].length) {
                        notify('Fill all the option')
                        errors=1
                    } else {
                        quiz.option1[i].map((obj) => obj === "" ? (notify('Fill all the option'), errors=1) : "")
                    }
                }
            }

        }
        if (errors===0) {
            if(state?.questionNo?.length){
                const response= await updateQuiz(quiz,state._id)
                if(response.data.message==='Quiz is update successfull'){
                    updateQuizSucess()
                    props.offEdit(false)
                    dispatch(Deleteupdate())
                }
            }else{
                const response = await createQuiz(quiz)
                if(response.data.message==="quiz create succesfulls"){
                    quizSucess()
                    setfinal(true)
                    setid(response.data.id)
                }
            }            
        }

    }
    useEffect(()=>{
        
    },[quiz])

    return (
        <div className={style.black_box}>
            {final?
            <div className={style.white_box2}>
                <div><img src={cross1} onClick={()=>(props.closeQuiz(false))} className={style.cross1}/></div>
                <div className={style.text1}>Congrats your Quiz is </div>
                <div className={style.text2}>Published!</div>
                <div className={style.link}>your link is here</div>
                <div className={style.share} onClick={() => (copy(),navigator.clipboard.writeText(`${window.location.href}quiz/${id}`))}>Share</div>
            </div>
            :next? <>
                <div className={style.white_box1}>
                    <div className={style.question}>
                        {quiz.questionNo.map((obj) => (
                            <>
                                {obj === 1 ? <div className={style.questionNo} onClick={() => (setquesNo(obj - 1), console.log(quesNo))}>{obj}</div> : <></>}
                                {obj > 1 ? <div className={style.questionNo1} onClick={() => (setquesNo(obj - 1), console.log(quesNo))}><div className={style.obj}>{obj}</div><div><img onClick={() => removeQuestion()} className={style.cross} src={cross} /></div></div> : <></>}
                            </>

                        ))}
                        {quiz.questionNo.length < 5 && <div><img onClick={() => addQuestion()} className={style.plus} src={plus} /></div>}
                    </div>
                    <div className={style.question1}>{quiz?.optionNo[quesNo]?<input onChange={(e) => changeText(e, "ques")} value={quiz?.question[quesNo] ? quiz.question[quesNo] : ""} className={style.qs} placeholder='Poll Question' />:<input onChange={(e) => changeText(e, "ques")} value={quiz?.question[quesNo-1] ? quiz.question[quesNo-1] : ""} className={style.qs} placeholder='Poll Question' />}</div>
                    <div className={style.question2}>
                        <div  className={style.Optiontype}>Option Type</div>
                        <div  className={style.Optiontype1}><label><input type='radio' value='text' onChange={(e) => selection(e)} checked={quiz.optionType === 'text'} className={style.inChoice} />  Text</label></div>
                        <div  className={style.Optiontype2}><label><input type='radio' value='image' onChange={(e) => selection(e)} className={style.inChoice} checked={quiz.optionType === 'image'} /> Image URL</label></div>
                        <div  className={style.Optiontype3}><label><input type='radio' value='textimage' onChange={(e) => selection(e)} className={style.inChoice} checked={quiz.optionType === 'textimage'} />  Text & Image URL</label></div>
                    </div>

                    <div className={style.option1}>
                        <div>
                            {quiz?.optionNo[quesNo]?quiz.optionNo[quesNo].map((obj) => (
                                <>
                                    {obj < 3 ? <div style={{ display: "flex", flexDirection: "row", boxSizing: "border-box", width: quiz.quizType === "Poll Type" ? "30vw" : "30.8vw" }}>
                                        {quiz.quizType === "Q & A" ? <div style={{ marginTop: "5%", marginLeft: "2%" }}><input onChange={(e) => changeText(e, 'correct', obj)} checked={quiz.correctOption[quesNo] === obj} className={style.option3} type='radio' /></div> : <></>}
                                        <div><input type='text' onChange={(e) => changeText(e, "opt", obj)} value={quiz?.option[quesNo] === undefined ? "" : quiz?.option[quesNo][obj - 1] ? quiz.option[quesNo][obj - 1] : ""} className={quiz.correctOption[quesNo] === obj ? quiz.optionType === 'textimage' ? style.option8 : style.option7 : quiz.optionType === 'textimage' ? style.option4 : style.option2} style={{ marginLeft: quiz.quizType === "Poll Type" ? quiz.optionType === "textimage" ? "35%" : "19%" : "" }} placeholder={quiz.optionType === 'textimage' ? "Text" : quiz.optionType === 'text' ? "Text" : "image URL"} /></div>
                                        {quiz.optionType === 'textimage' ? <input type='text' onChange={(e) => changeText(e, "", obj)} value={quiz?.option1[quesNo] === undefined ? "" : quiz?.option1[quesNo][obj - 1] ? quiz.option1[quesNo][obj - 1] : ""} placeholder="image URL" style={{ marginLeft: quiz.quizType === "Poll Type" ? "18%" : "13%" }} className={quiz.correctOption[quesNo] === obj ? style.newoption1 : style.newoption} /> : <></>}
                                    </div> : <></>}
                                    {obj > 2 ? <div style={{ display: "flex", flexDirection: "row" }}>
                                        {quiz.quizType === "Q & A" ? <div style={{ marginTop: "5%", marginLeft: "2%" }}><input onChange={(e) => changeText(e, "correct", obj)} checked={quiz.correctOption[quesNo] === obj} className={style.option3} type='radio' /></div> : <></>}
                                        <div><input type='text' onChange={(e) => changeText(e, "opt", obj)} value={quiz?.option[quesNo] === undefined ? "" : quiz?.option[quesNo][obj - 1] ? quiz.option[quesNo][obj - 1] : ""} className={quiz.correctOption[quesNo] === obj ? quiz.optionType === 'textimage' ? style.option8 : style.option7 : quiz.optionType === 'textimage' ? style.option4 : style.option2} style={{ marginLeft: quiz.quizType === "Poll Type" ? quiz.optionType === "textimage" ? "35%" : "19%" : "" }} placeholder={quiz.optionType === 'textimage' ? "Text" : quiz.optionType === 'text' ? "Text" : "image URL"} /></div>
                                        {quiz.optionType === 'textimage' ? <input type='text' onChange={(e) => changeText(e, "", obj)} value={quiz?.option1[quesNo] === undefined ? "" : quiz?.option1[quesNo][obj - 1] ? quiz.option1[quesNo][obj - 1] : ""} placeholder="image URL" style={{ marginLeft: quiz.quizType === "Poll Type" ? "17%" : "" }} className={quiz.correctOption[quesNo] === obj ? style.newoption1 : style.newoption} /> : <></>}
                                        <div><img className={quiz.optionType === 'textimage' ? style.delete : style.deletes} src={deletes} style={{ marginLeft: quiz.quizType === "Poll Type" ? quiz.optionType === "textimage" ? "" : "6vw" : "" }} onClick={() => removeOption()} /></div>
                                    </div> : <></>}
                                </>
                            )):
                            quiz.optionNo[quesNo-1].map((obj) => (
                                <>
                                    {obj < 3 ? <div style={{ display: "flex", flexDirection: "row", boxSizing: "border-box", width: quiz.quizType === "Poll Type" ? "30vw" : "30.8vw" }}>
                                        {quiz.quizType === "Q & A" ? <div style={{ marginTop: "5%", marginLeft: "2%" }}><input onChange={(e) => changeText(e, 'correct', obj)} checked={quiz.correctOption[quesNo-1] === obj} className={style.option3} type='radio' /></div> : <></>}
                                        <div><input type='text' onChange={(e) => changeText(e, "opt", obj)} value={quiz?.option[quesNo-1] === undefined ? "" : quiz?.option[quesNo-1][obj - 1] ? quiz.option[quesNo-1][obj - 1] : ""} className={quiz.correctOption[quesNo-1] === obj ? quiz.optionType === 'textimage' ? style.option8 : style.option7 : quiz.optionType === 'textimage' ? style.option4 : style.option2} style={{ marginLeft: quiz.quizType === "Poll Type" ? quiz.optionType === "textimage" ? "35%" : "19%" : "" }} placeholder={quiz.optionType === 'textimage' ? "Text" : quiz.optionType === 'text' ? "Text" : "image URL"} /></div>
                                        {quiz.optionType === 'textimage' ? <input type='text' onChange={(e) => changeText(e, "", obj)} value={quiz?.option1[quesNo-1] === undefined ? "" : quiz?.option1[quesNo-1][obj - 1] ? quiz.option1[quesNo-1][obj - 1] : ""} placeholder="image URL" style={{ marginLeft: quiz.quizType === "Poll Type" ? "18%" : "13%" }} className={quiz.correctOption[quesNo-1] === obj ? style.newoption1 : style.newoption} /> : <></>}
                                    </div> : <></>}
                                    {obj > 2 ? <div style={{ display: "flex", flexDirection: "row" }}>
                                        {quiz.quizType === "Q & A" ? <div style={{ marginTop: "5%", marginLeft: "2%" }}><input onChange={(e) => changeText(e, "correct", obj)} checked={quiz.correctOption[quesNo-1] === obj} className={style.option3} type='radio' /></div> : <></>}
                                        <div><input type='text' onChange={(e) => changeText(e, "opt", obj)} value={quiz?.option[quesNo-1] === undefined ? "" : quiz?.option[quesNo-1][obj - 1] ? quiz.option[quesNo-1][obj - 1] : ""} className={quiz.correctOption[quesNo-1] === obj ? quiz.optionType === 'textimage' ? style.option8 : style.option7 : quiz.optionType === 'textimage' ? style.option4 : style.option2} style={{ marginLeft: quiz.quizType === "Poll Type" ? quiz.optionType === "textimage" ? "35%" : "19%" : "" }} placeholder={quiz.optionType === 'textimage' ? "Text" : quiz.optionType === 'text' ? "Text" : "image URL"} /></div>
                                        {quiz.optionType === 'textimage' ? <input type='text' onChange={(e) => changeText(e, "", obj)} value={quiz?.option1[quesNo-1] === undefined ? "" : quiz?.option1[quesNo-1][obj - 1] ? quiz.option1[quesNo-1][obj - 1] : ""} placeholder="image URL" style={{ marginLeft: quiz.quizType === "Poll Type" ? "17%" : "" }} className={quiz.correctOption[quesNo-1] === obj ? style.newoption1 : style.newoption} /> : <></>}
                                        <div><img className={quiz.optionType === 'textimage' ? style.delete : style.deletes} src={deletes} style={{ marginLeft: quiz.quizType === "Poll Type" ? quiz.optionType === "textimage" ? "" : "6vw" : "" }} onClick={() => removeOption()} /></div>
                                    </div> : <></>}
                                </>))
                            }
                            {quiz.optionNo[quesNo]?quiz.optionNo[quesNo].length < 4 && <div className={style.addOption} onClick={() => addOption()}>Add Option</div>:quiz.optionNo[quesNo-1].length < 4 && <div className={style.addOption} onClick={() => addnew()}>Add Option</div>}
                        </div>
                        {quiz.quizType === "Q & A" ? <div className={style.time}>
                            <div className={style.timer}>Timer</div>
                            <div className={quiz.timer === 0 ? style.sec1 : style.sec} onClick={() => setquiz({ ...quiz, timer: 0 })}>OFF</div>
                            <div className={quiz.timer === 5 ? style.sec1 : style.sec} onClick={() => setquiz({ ...quiz, timer: 5 })}>5 sec</div>
                            <div className={quiz.timer === 10 ? style.sec1 : style.sec} onClick={() => setquiz({ ...quiz, timer: 10 })}>10 sec</div>
                        </div> : <></>}
                    </div>

                    <div className={style.last}>
                        <div className={style.cancel1} onClick={()=>state?.questionNo?.length?(props.offEdit(false),dispatch(Deleteupdate())):(props.closeQuiz(false))}>Cancel</div>
                        <div className={style.continue1} onClick={() => creatQuiz()}>{state?.questionNo?.length?"Update Quiz":"Create Quiz"}</div>
                    </div>
                </div></> :<div className={style.white_box}>
                    <input className={style.name} name='quizName' value={quiz?.quizName} placeholder="Quiz name" onChange={(e) => addInfo(e)} />
                    <div className={style.choice}>
                        <div className={style.type}>Quiz Type</div>
                        <div className={style.qa} style={{ backgroundColor: quiz.quizType === "Q & A" ? "#60B84B" : "", color: quiz.quizType === "Q & A" ? "#FFFFFF" : "" }} onClick={() => setquiz({ ...quiz, quizType: "Q & A" })}>Q & A</div>
                        <div className={style.poll} style={{ backgroundColor: quiz.quizType === "Poll Type" ? "#60B84B" : "", color: quiz.quizType === "Poll Type" ? "#FFFFFF" : "" }} onClick={() => setquiz({ ...quiz, quizType: "Poll Type" })}>Poll Type</div>
                    </div>
                    <div className={style.choice1}>
                        <div className={style.cancel} onClick={()=>state?.questionNo?.length?(props.offEdit(false),dispatch(Deleteupdate())):(props.closeQuiz(false))}>Cancel</div>
                        <div className={style.continue} onClick={() => continueToNext()}>Continue</div>
                    </div>
                </div>}
            
            
            <Toaster  />
        </div>
    )
}

export default Createquiz
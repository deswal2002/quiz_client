import React, { useEffect, useState } from 'react'
import style from './TrendingQuiz.module.css'
import { trendingQuiz } from '../../Apis/quiz'
import eye from '../../assets/Image/eye.svg'
function TrendingQuiz() {
    const [totalQuiz,settotalQuiz]=useState()
    const [totalQuestion,settotalQuestion]=useState()
    const [totalImpression,settotalImpression]=useState()
    const [trendingQuizs,settrendingQuiz]=useState([])

    useEffect(()=>{
        const run=async()=>{
            try {
                const response=await trendingQuiz()
                settotalImpression(response.data.totalImpression)
                settotalQuestion(response.data.totalQuestion)
                settotalQuiz(response.data.totalQuiz)
                settrendingQuiz(response.data.trendingQuiz)
            } catch (error) {
                console.log(error)
            }
        }
        run()
    },[])
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
    <div className={style.box}>
        <div className={style.add}>
            <div className={style.smallAdd} style={{color:'#FF5D01'}}>
                <div style={{display:"flex",flexDirection:'row'}}><div className={formatNumber(style.text1)}>{totalQuiz}</div>
                <div className={style.text2}>&nbsp; Quiz</div></div>
                <div className={style.text3}>Created</div>
            </div>
            <div className={style.smallAdd} style={{color:'#60B84B'}}>
                <div style={{display:"flex",flexDirection:'row'}}><div className={style.text1}>{formatNumber(totalQuestion)}</div>
                <div className={style.text2}>&nbsp;questions </div></div>
                <div className={style.text3}>Created</div>
            </div>
            <div className={style.smallAdd} style={{color:'#5076FF'}}>
                <div style={{display:"flex",flexDirection:'row'}}><div className={style.text1}> {formatNumber(totalImpression)}</div>
                <div className={style.text2}>&nbsp; Total </div></div>
                <div className={style.text3}>Impressions</div>
            </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',width:'85%'}}>
            <div className={style.text}>Trending Quizs</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'2%'}}>
                {trendingQuizs?.map((obj)=>(<div className={style.trendingbox}>
                    <div className={style.box1}>
                        <div className={style.quizname} style={{fontSize:obj.quizName.length>13?obj.quizName.length>27?"0.8rem":"1.2rem":""}} >{obj.quizName}</div>
                        <div className={style.eye}>
                            <div className={style.eye1}>{formatNumber(obj.impression)}</div>
                            <div><img src={eye}/></div>
                        </div>
                    </div>
                    <div className={style.creat}>Created on : {createAt(obj.createdAt)}</div>
                </div>))}
            </div>
        </div>
        <div style={{marginBottom:"4%"}}></div>
    </div>
  )
}

export default TrendingQuiz
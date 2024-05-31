import { createSlice } from '@reduxjs/toolkit'

export const FileSlice = createSlice({
    name: 'File_save',
    initialState:{QuizId:{},login:false},
    reducers: {
      update: (state,actions) => {
        state.QuizId=actions.payload 
      },
      Deleteupdate:(state)=>{
        state.QuizId={}
        state.login=false
      },
      updateLogin:(state)=>{
        state.login=true
      }
      
    }
  })
  export const { update,Deleteupdate,updateLogin } = FileSlice.actions
  
  export default FileSlice.reducer
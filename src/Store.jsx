import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './FileSlice'

const store = configureStore({
  reducer: {
    File_save:counterReducer,
  },
})
export default store;
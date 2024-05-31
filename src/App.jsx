import Home from "./Pages/Home/Home"
import Login_register from "./Pages/Login_register/Login_register"
import { BrowserRouter,Route,Routes } from "react-router-dom";
import Quiz from "./Pages/Quiz/Quiz";


function App() {
  
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/auth" element={<Login_register/>}/>
        <Route path="/quiz/:id" element={<Quiz/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

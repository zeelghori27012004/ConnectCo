import{Routes,Route} from "react-router-dom"



import Navbar from "./components/navbar.component";
const App=()=>{
  return(
    <Routes>
      <Route path="/" element={<Navbar/>}>
        <Route path="signin" element={<userAuthForm type="sign-in"/>}/>
        <Route path="signup" element={<userAuthForm type="sign-up"/>}/> 
      </Route>
    </Routes>
  );
}
export default App;
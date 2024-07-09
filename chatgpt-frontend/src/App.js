
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from './Pages/ChatPage/ChatPage'
import LoginPage from './Pages/LoginPage';
import SignUp from './Pages/SignUp';
import LandingPage from './Pages/LandingPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
  <Routes>
  <Route path='/'element={<Chat/>}></Route>
  <Route path='/home'element={<LandingPage/>}></Route>
  <Route path='/login'element={<LoginPage/>}></Route>
  <Route path='/signup'element={<SignUp/>}></Route>
 
  </Routes>
</BrowserRouter>
    </div>
  );
}

export default App;
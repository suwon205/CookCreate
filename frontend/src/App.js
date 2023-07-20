import React, {useEffect} from 'react';
import NavBar from './component/NavBar';
import SignUp from './component/SignUp';
import LogIn from './component/LogIn'
import MainPage from './component/MainPage';
import { Link, Route, Routes, Router } from 'react-router-dom';
import Footer from './component/Footer';
function App() {
  return (
    <div>
      <NavBar/>
      <Routes>
        <Route path='/' element={<MainPage/>}></Route>
        <Route path='signup' element={<SignUp/>}></Route>
        <Route path='login' element={<LogIn/>}></Route>
      </Routes>
      <br/>
      <hr/>
      <Footer/>
    </div>
  );
}

export default App;

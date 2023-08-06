import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, logout } from './store/auth/auth'
import CookyerScreen from './pages/video/cookyerScreen';
import CookieeScreen from './pages/video/cookieeScreen';
import AppWithLayout from './component/AppWithLayout';
import Login from './component/LogIn/LogIn';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedNickname = localStorage.getItem('nickname');
    const storedRole = localStorage.getItem('role')
    const access_token = localStorage.getItem('access_token')
    const refresh_token = localStorage.getItem('refresh_token')
    const userId = localStorage.getItem('id')
    if (access_token) {
      dispatch(login({
        'access_token' : access_token,
        'refresh_token' : refresh_token,
        'nickname' : storedNickname, 
        'role' : storedRole,
        'userId' : userId
      }));
    } else {
      dispatch(logout());
    }
  }, [dispatch]);


  return (
    <div>
      <Routes>
        <Route path='*' element={<AppWithLayout/>}/>
        <Route path='/videoLesson/COOKYER' element={<CookyerScreen/>}></Route>
        <Route path='/videoLesson/COOKIEE' element={<CookieeScreen/>}></Route>
      </Routes>
    </div>
  );
}

export default App;

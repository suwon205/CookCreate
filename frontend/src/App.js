import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import CookyerScreen from './pages/video/cookyerScreen';
import CookieeScreen from './pages/video/cookieeScreen';
import AppWithLayout from './component/AppWithLayout';

function App() {
  useEffect(() => {
    const access_token = sessionStorage.getItem('access_token');
    const local_access_token = localStorage.getItem('access_token')
    const local_refresh_token = localStorage.getItem('refresh_token')
    if (!access_token) {
      axios.post(`/api/v1/member/logout`, {}, {
        headers: {
          Access_Token: local_access_token,
          Refresh_Token: local_refresh_token
        }
      })
      .then(() => {
        localStorage.clear();
        window.location.replace('/');
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }, []);

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

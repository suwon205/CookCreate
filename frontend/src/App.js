import React, { useEffect } from 'react';
import NavBar from './component/Header/NavBar';
import SignUp from './pages/signUp';
import LogIn from './pages/logIn';
import MainPage from './pages/mainPage';
import Footer from './component/Footer/Footer';
import TotalLessons from './pages/totalLessons';
import SignUpBefore from './pages/signUpBefore';
import RegisterLesson from './pages/registerLesson'
import { Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, logout } from './store/auth/auth'
import CookyerScreen from './pages/video/cookyerScreen';
import CookieeScreen from './pages/video/cookieeScreen';
import LessonItem from './component/TotalLessons/LessonItem';
import MyPageS from './pages/myPageS';
import Calendar from './component/MyPageS/Calendar';
import ClassList from './component/MyPageS/ClassList';
import LikeList from './component/MyPageS/LikeList';
import Payment from './component/MyPageS/Payment';
import RecipeBook from './component/MyPageS/RecipeBook';
import Review from './component/MyPageS/Review';
import Account from './component/MyPageS/Account';
import MyPageT from './pages/myPageT';
import CalendarT from './component/MyPageT/Calendar';
import ClassListT from './component/MyPageT/ClassList';
import AccountT from './component/MyPageT/Account';
import PayrollT from './component/MyPageT/Payroll';
import ReviewT from './component/MyPageT/Review';
import CertifyT from './component/MyPageT/Certify';

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
      <NavBar />
      {/* 링크 이곳에 추가 */}
      <Routes>
        <Route path='/mypageS' element={<MyPageS />} />
        <Route path='/mypageT' element={<MyPageT />} />
        <Route path='/' element={<MainPage />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/totallessons' element={<TotalLessons />} />
        <Route path='/signupbefore' element={<SignUpBefore/>}/>
        <Route path='/registerlesson' element={<RegisterLesson/>}></Route>
        <Route path='/videoLesson/COOKYER' element={<CookyerScreen/>}></Route>
        <Route path='/videoLesson/COOKIEE' element={<CookieeScreen/>}></Route>
        <Route path='/lesson/:id' element={<LessonItem/>}></Route>
        <Route path="/calendar" element={<Calendar />}/>
        <Route path="/classList" element={<ClassList />}/>
        <Route path="/likeList" element={<LikeList />}/>
        <Route path="/payment" element={<Payment />}/>
        <Route path="/recipeBook" element={<RecipeBook />}/>
        <Route path="/review" element={<Review />}/>
        <Route path="/account" element={<Account />}/>
        <Route path="/accountT" element={<AccountT />}/>
        <Route path="/classlistT" element={<ClassListT />}/>
        <Route path="/payrollT" element={<PayrollT />}/>
        <Route path="/reviewT" element={<ReviewT />}/>
        <Route path="certificationT" element={<CertifyT />}/>
        <Route path="calendarT" element={<CalendarT />}/>
      </Routes>
      <br />
      <hr />
      <Footer />
    </div>
  );
}

export default App;

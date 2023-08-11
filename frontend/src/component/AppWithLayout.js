import React, { useEffect } from 'react';
import NavBar from './Header/NavBar';
import SignUp from '../pages/signUp';
import LogIn from '../pages/logIn';
import MainPage from '../pages/mainPage';
import Footer from './Footer/Footer';
import TotalLessons from '../pages/totalLessons';
import LessonDetail from '../pages/lessonDetail';
import SignUpBefore from '../pages/signUpBefore';
import RegisterLesson from '../pages/registerLesson'
import { Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, logout } from '../store/auth/auth'
import LessonItem from '../pages/lessonDetail';
import MyPageS from '../pages/myPageS';
import Calendar from './MyPageS/Calendar';
import ClassList from './MyPageS/ClassList';
import LikeList from './MyPageS/LikeList';
import Payment from './MyPageS/Payment';
import RecipeBook from './MyPageS/RecipeBook';
import Review from './MyPageS/Review';
import Account from './MyPageS/Account';
import MyPageT from '../pages/myPageT';
import CalendarT from './MyPageT/Calendar';
import ClassListT from './MyPageT/ClassList';
import AccountT from './MyPageT/Account';
import PayrollT from './MyPageT/Payroll';
import ReviewT from './MyPageT/Review';
import CertifyT from './MyPageT/Certify';
import PaymentFailed from '../pages/paymentFailed';
import PaymentSuccess from '../pages/paymentSuccess';
import PaymentCancelld from '../pages/paymentCancelld';
import EditLesson from '../pages/editLesson';

import ChatList from '../pages/chatList';
import ChatRoom from '../pages/chatRoom';

function AppWithLayout({ match }) {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   const storedNickname = localStorage.getItem('nickname');
  //   const storedRole = localStorage.getItem('role')
  //   const access_token = localStorage.getItem('access_token')
  //   const refresh_token = localStorage.getItem('refresh_token')
  //   const userId = localStorage.getItem('id')
  //   if (access_token) {
  //     dispatch(login({
  //       'access_token' : access_token,
  //       'refresh_token' : refresh_token,
  //       'nickname' : storedNickname, 
  //       'role' : storedRole,
  //       'userId' : userId
  //     }));
  //   } else {
  //     dispatch(logout());
  //   }
  // }, [dispatch]);


  return (
    <div className="container">
      <NavBar />
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='login' element={<LogIn />} />
        <Route path='/lesson' element={<TotalLessons />} />
        <Route path='/signupbefore' element={<SignUpBefore/>}/>
        <Route path='/registerlesson' element={<RegisterLesson/>}></Route>
        <Route path='/lesson/:id' element={<LessonItem/>}></Route>
        <Route path="/lesson/:lessonId" element={<LessonDetail/>} />
        <Route path='/payment/fail' element={<PaymentFailed/>}></Route>
        <Route path='/payment/success' element={<PaymentSuccess/>}></Route>
        <Route path='/payment/cancel' element={<PaymentCancelld/>}></Route>
        <Route path='/lesson/edit/:lessonId' element={<EditLesson/>}></Route>
        {/* <Route path='/chatroom' element={<ChatRoom/>}></Route> */}

        
        {/* <Route path='/chatlist' element={<ChatList />} /> */}
        <Route path='/chatroom' element={<ChatRoom />} />
        {/* <Route path='/chatroom' element={<ChatRoom />} /> */}

        <Route path='/mypageS' element={<MyPageS />} />
        <Route path='/mypageT' element={<MyPageT />} />
        <Route path="/calendar" element={<Calendar />}/>
        <Route path="/calendarT" element={<CalendarT />}/>
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
        <Route path="/certificationT" element={<CertifyT />}/>
      </Routes>
      <Footer />
    </div>
  );
}

export default AppWithLayout;


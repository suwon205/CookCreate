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
import ClassList from './MyPageS/ClassList';
import Payment from './MyPageS/Payment';
import RecipeBook from './MyPageS/RecipeBook';
import Review from './MyPageS/Review';
import Account from './MyPageS/Account';
import MyPageT from '../pages/myPageT';
import ClassListT from './MyPageT/ClassList';
import AccountT from './MyPageT/Account';
import PayrollT from './MyPageT/Payroll';
import ReviewT from './MyPageT/Review';
import CertifyT from './MyPageT/Certify';
import PaymentFailed from '../pages/paymentFailed';
import PaymentSuccess from '../pages/paymentSuccess';
import PaymentCancelld from '../pages/paymentCancelld';
import EditLesson from '../pages/editLesson';
import GestureTest from '../pages/video/gestureTest';
import NotFound from "../pages/notFound";

import ChatList from '../pages/chatList';
import ChatRoom from '../pages/chatRoom';

function AppWithLayout({ match }) {

  return (
    <div>
      <NavBar />
      <div className="container">
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
         
          <Route path='/chatroom' element={<ChatRoom />} />

          <Route path='/mypageS' element={<MyPageS />} />
          <Route path='/mypageT' element={<MyPageT />} />
          <Route path="/classList" element={<ClassList />}/>
          <Route path="/payment" element={<Payment />}/>
          <Route path="/recipeBook" element={<RecipeBook />}/>
          <Route path="/review" element={<Review />}/>
          <Route path="/account" element={<Account />}/>
          <Route path="/accountT" element={<AccountT />}/>
          <Route path="/classlistT" element={<ClassListT />}/>
          <Route path="/payrollT" element={<PayrollT />}/>
          <Route path="/reviewT" element={<ReviewT />}/>
          <Route path="/certificationT" element={<CertifyT />}/>
          <Route path="/gestureTest" element={<GestureTest />}/>

          <Route path='*' element={<NotFound />} />

        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default AppWithLayout;


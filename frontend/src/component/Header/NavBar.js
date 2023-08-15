import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useSelector } from "react-redux";
import '../../style/navbar.css'
import '../../style/video.css'
import AppliedLessonMenu from './AppliedLessonMenu';
import UserDropMenu from './UserDropMenu';
import axios from 'axios';

function NavBar() {
  const isLogin = useSelector((state) => state.auth.isLogin)

  const access_token = localStorage.getItem('access_token')
  const nickname = localStorage.getItem('nickname')
  const role = localStorage.getItem('role')
  const emoji = localStorage.getItem('emoji')

  /** 신청 수업 드롭다운 */
  const [ lessonDropdown, setLessonDropdown ] = useState(false)
  const [ myLessons, setMyLessons ] = useState(undefined)  // 학생 모달창에 불러서 쓸 레슨 정보

  /** 유저 드롭다운 */
  const [ userDropdown, setUserDropdown ] = useState(false)

  /** 쿠키 신청 메뉴 드롭다운 */
  const dropLessonMenu = () => {
    console.log(!lessonDropdown)
    setLessonDropdown((prev) => !prev)
  }

  /** 유저 메뉴 드롭다운 */
  const dropUserMenu = (data) => {
    console.log(!userDropdown)
    setUserDropdown(data)
    // setUserDropdown((prev) => !prev)
  }

  const location = useLocation();
  const mainPageStyle = location.pathname === '/';

  useEffect(() => {  // 레슨 정보 받아오는 부분  // 누를때마다 요청되므로 나중에 스토어에 저장하던지 위치 바꿔주기
    if (access_token && role === 'COOKIEE') {
      axios.get(
        `api/v1/my/applied`,
        {
          headers : {
            Access_Token : access_token
          }
        })
        .then((res) => {
          console.log(res.data)
          console.log('신청한 수업 목록 받아와짐')
        if (res.data[0].message !== "신청한 과외가 없습니다.") {
          setMyLessons(res.data)
        } else {
          setMyLessons(undefined)
        }

        })
        .catch((err) => {
          console.log(err)
          console.log('신청한 수업 목록 안받아와짐')
        })
    }
  }, [access_token, role])

  return (
    <div className={`navbar ${mainPageStyle ? 'navbar-main' : ''}`}>
      <div className="leftNav">
        <Link to='/' className='logo'>
          <img src= "/logo.png" alt="로고" className='logo' />
        </Link> 
        <Link to='/lesson'>
          수업 전체
        </Link>
        <SearchBar />
      </div>
      {isLogin ? (
        <div className="rightNav">
          <Link to='/chatroom' >채팅</Link>
          <div className="nav-lesson">
            {role === 'COOKYER' ? <Link to='registerlesson'>과외 등록</Link> : null} 
            {role === 'COOKIEE' ? (
            <div className='dropdown'>
              <button className='drop-btn' onClick={dropLessonMenu}>신청수업</button>
              { lessonDropdown ? (
                <div onMouseLeave={() => dropLessonMenu(false)} className="drop-wrap">
                  <AppliedLessonMenu myLessons={myLessons}/>
                </div>
              ) : null}
            </div>
        ) : null}
            <div onClick={() => dropUserMenu(true)} className="nav-user">
              {emoji}
              {nickname}
              님
            { userDropdown ? (
              <div onMouseLeave={() => dropUserMenu(false)} className="drop-wrap">
                <UserDropMenu/>
              </div>
            ) : null}
              {/* 쿠커들에게만 보입니다. */}
            </div>
          </div>
        </div>
        
      ) : (
          <React.Fragment>
            <div>
              <Link to='/login'>
                로그인
              </Link> 
              <Link to='/signupbefore'>
                회원가입
              </Link>
            </div>
        </React.Fragment>
      )} 
      {/* {role === 'COOKYER' ? <button onClick={() => createRoom(5)}>쿠커화면</button> : null} */}
    </div>
  );
}

export default NavBar;

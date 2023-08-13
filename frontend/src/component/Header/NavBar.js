import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useSelector } from "react-redux";
import '../../style/navbar.css'
import '../../style/video.css'
import AppliedLessonMenu from './AppliedLessonMenu';
import UserDropMenu from './UserDropMenu';

function NavBar() {
  const isLogin = useSelector((state) => state.auth.isLogin)

  const nickname = localStorage.getItem('nickname')
  const role = localStorage.getItem('role')
  const emoji = localStorage.getItem('emoji')

  /** 신청 수업 드롭다운 */
  const [ lessonDropdown, setLessonDropdown ] = useState(false)

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

  return (
    <div className='navbar'>
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
          <div className="nav-cookyer">
            {role === 'COOKYER' ? <Link to='registerlesson'>과외 등록</Link> : null} 
            {role === 'COOKIEE' ? (
            <div className='dropdown'>
              <button className='drop-btn' onClick={dropLessonMenu}>신청수업</button>
              { lessonDropdown ? (
                <div onMouseLeave={() => dropLessonMenu(false)}>
                  <AppliedLessonMenu />
                </div>
              ) : null}
            </div>
        ) : null}
            <div onClick={() => dropUserMenu(true)} className="nav-user">
              {emoji}
              {nickname}
              님
            { userDropdown ? (
              <div onMouseLeave={() => dropUserMenu(false)}>
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

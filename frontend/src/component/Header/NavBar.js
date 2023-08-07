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
  const dropUserMenu = () => {
    console.log(!userDropdown)
    setUserDropdown((prev) => !prev)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }} className='navbar'>
      <Link to='/'>
        로고
      </Link> |
      <Link to='/lesson'>
        수업 전체
      </Link>
      
      <SearchBar />
      {isLogin ? (
        <div>
          <div onClick={dropUserMenu}>
            {emoji}
            {nickname}
          </div>
          { userDropdown ? (
            <UserDropMenu/>
          ) : null}
          {/* 쿠커들에게만 보입니다. */}
          {role === 'COOKYER' ? <Link to='registerlesson'>과외 등록</Link> : null} 
        </div>
      ) : (
        <React.Fragment>
          <Link to='/login'>
            로그인
          </Link> |
          <Link to='/signupbefore'>
            회원가입
          </Link>
        </React.Fragment>
      )} | 
      {role === 'COOKIEE' ? (
        <div className='dropdown'>
          <button className='drop-btn' onClick={dropLessonMenu}>신청수업</button>
          { lessonDropdown ? (
            <AppliedLessonMenu />
          ) : null}
        </div>
      ) : null}
      {/* {role === 'COOKYER' ? <button onClick={() => createRoom(5)}>쿠커화면</button> : null} */}
    </div>
  );
}

export default NavBar;

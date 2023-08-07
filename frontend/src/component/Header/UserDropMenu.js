import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';

function UserDropMenu() {
  const access_token = localStorage.getItem('access_token')
  const refresh_token = localStorage.getItem('refresh_token')
  const role = localStorage.getItem('role')

  const Logout = () => {

    console.log(access_token, refresh_token)
    axios.post(`api/v1/member/logout`, {}, {
      headers : {
        access_token : access_token,
        refresh_token : refresh_token
      }
    })
    .then(() => {
      localStorage.clear()
      window.location.replace("/");
    })
    .catch((err) => {
      console.log(err)
      alert('access_token이 만료되었습니다. 개발 시에는 local의 토큰을 모두 지워 주고 새로고침을 해주세요.')
    })
  }

  return (
    <div className='dropdown-content'>
      {role === 'COOKIEE' ? (
        <Link to='/account'>
          마이페이지
        </Link>
      ) : (
        <Link to='/accountT'>
          마이페이지
        </Link>
      )}
      <p onClick={Logout}>로그아웃</p>
    </div>
  );
}

export default UserDropMenu;
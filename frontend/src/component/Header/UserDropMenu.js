import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';

function UserDropMenu() {
  const access_token = localStorage.getItem('access_token')
  const refresh_token = localStorage.getItem('refresh_token')
  const role = localStorage.getItem('role')

  const Logout = () => {

    console.log(access_token, refresh_token)
    axios.post(`/api/v1/member/logout`, {}, {
      headers : {
        Access_Token : access_token,
        Refresh_Token : refresh_token
      }
    })
    .then(() => {
      localStorage.clear()
      window.location.replace("/");
      window.scrollTo({ top: 0, behavior: 'smooth' });

    })
    .catch((err) => {
      console.log(err)
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
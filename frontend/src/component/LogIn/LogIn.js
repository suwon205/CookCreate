import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../store/auth/auth';
import '../../style/auth/login.css';
import sessionStorage from 'redux-persist/es/storage/session';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const handleLogin = () => {
    axios
      .post(
        `api/v1/auth/login`, 
        { userId, userPw }
        )
      .then((res) => {
        const { access_token, refresh_token } = res.headers;
        dispatch(
          login({
            access_token: access_token,
            refresh_token: refresh_token,
            userId,
            nickname: res.data.nickname,
            role: res.data.role,
          })
        );
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        sessionStorage.setItem('access_token', access_token) // 창 닫으면 로그아웃 구현

        if (rememberMe) {
          localStorage.setItem('remembered_userId', userId);
        } else {
          localStorage.removeItem('remembered_userId');
        }

        navigate('/');
      })
      .catch((err) => {
        setErrMsg('아이디 또는 비밀번호를 잘못 입력했습니다.');
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className='loginpage'>
      <div className='logintitleWrap'>로그인</div>
      <div className='logincontentWrap'>
        <div className='logininputTitle'>아이디</div>
        <div className='logininputWrap'>
          <input
            type='text'
            className='logininput'
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
            }}
            onKeyDown={handleKeyDown} // 엔터 키 이벤트 처리
            placeholder='아이디'
            autoComplete='off'
          />
        </div>

        <div className='rememberMeContainer'>
          <input
            type='checkbox'
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className='rememberMeCheckbox'
            id='rememberMeCheckbox'
          />
          <label htmlFor='rememberMeCheckbox' className='rememberMeLabel'>
            아이디 기억하기
          </label>
        </div>

        <div className='logininputTitle'>비밀번호</div>
        <div className='logininputWrap'>
          <input
            type='password'
            className='logininput'
            value={userPw}
            onChange={(e) => {
              setUserPw(e.target.value);
            }}
            onKeyDown={handleKeyDown} // 엔터 키 이벤트 처리
            placeholder='비밀번호'
            autoComplete='current-password'
          />
        </div>

        {/* 나머지 내용 */}
      </div>
      <div className='bottomBtnContainer'>
        <button onClick={handleLogin} className='loginbottomBtn'>
          로그인
        </button>
      </div>
      {errMsg && <div className='errMsg'>{errMsg}</div>}
    </div>
  );
}

export default Login;

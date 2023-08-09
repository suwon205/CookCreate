  import axios from 'axios';
  import React, { useState } from 'react';
  import { useDispatch } from 'react-redux';
  import { useNavigate } from 'react-router-dom';
  import { login } from '../../store/auth/auth'
  import '../../style/auth/login.css';

  function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userId, setUserId] = useState('');
    const [userPw, setUserPw] = useState('');
    const [errMsg, setErrMsg] = useState('')
    const handleLogin = (e) => {
      e.preventDefault()
      axios.post(`api/v1/auth/login`, {userId, userPw})
      .then((res)=>{
        const { access_token, refresh_token } = res.headers;
        dispatch(login({
          access_token : res.headers.access_token, 
          refresh_token : res.headers.refresh_token,
          userId,
          nickname: res.data.nickname,
          role : res.data.role}));
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        navigate("/")
      })
      .catch((err) =>{
        setErrMsg("아이디 또는 비밀번호를 잘못 입력했습니다.")
      })
    }

    return (
      <div className='loginpage'>
        <div className='logintitleWrap'>
          로그인
        </div>
        <div className='logincontentWrap'>
            <div className='logininputTitle'>아이디</div>
            <div className='logininputWrap'>
              <input type="text"
                className='logininput'
                value={userId}
                onChange={(e)=>{
                  setUserId(e.target.value)
                }}
                placeholder='아이디'
                autoComplete="off"
              />
            </div>

            <div className='logininputTitle'>비밀번호</div>
            <div className='logininputWrap'>
              <input type="password"
              className='logininput'
              value={userPw}
              onChange={(e) =>{
                setUserPw(e.target.value)
              }}
              placeholder='비밀번호'
              autoComplete="current-password"
              />
            </div>

          <div className="bottomBtnContainer">
            <button 
              onClick ={handleLogin} 
              className='loginbottomBtn'
            >로그인</button>
          </div>

          {errMsg}
        </div>
      </div>
    );
  }

  export default Login;
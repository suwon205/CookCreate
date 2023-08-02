  import axios from 'axios';
  import React, { useState } from 'react';
  import { useDispatch } from 'react-redux';
  import { useNavigate } from 'react-router-dom';
  
  import { login } from '../../store/auth/auth'

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
        dispatch(login({
          access_token : res.headers.access_token, 
          refresh_token : res.headers.refresh_token,
          userId,
          nickname: res.data.nickname,
          role : res.data.role}));
        navigate("/")
      })
      .catch((err) =>{
        setErrMsg(err.response.data.message)
      })
    }

    return (
      <div className='page'>
        <div className='titleWrap'>
          아이디와 비밀번호를 <br />
          입력해주세요
        </div>
        <div className='contentWrap'>
          <div className='inputTitle'>아이디</div>
            <div>
              <div className='inputWrap'/>
              <input type="text"
              className='input'
              value={userId}
              onChange={(e)=>{
                setUserId(e.target.value)
              }}
              placeholder='아이디'
              autoComplete="off"
              />
            </div>

            <div className='inputTitle'>비밀번호</div>
            <div>
              <div className='inputWrap'/>
              <input type="password"
              className='input'
              value={userPw}
              onChange={(e) =>{
                setUserPw(e.target.value)
              }}
              placeholder='비밀번호'
              autoComplete="current-password" // 자동완성 방지
              />
            </div>
            <br />
            
            <button onClick ={handleLogin} className='bottomBtn'>확인</button>
          {errMsg}
        </div>
      </div>
    );
  }

  export default Login;
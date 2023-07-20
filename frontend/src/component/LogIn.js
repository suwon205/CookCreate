import axios from 'axios';
import React, { useState } from 'react';

function Login() {
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');

  const handleLogin = (e) => {
    e.preventDefault()
    axios.post(`api/v1/auth/login`, {userId, userPw})
    .then((res)=>{
      console.log('로그인 성공', res)
    })
    .catch((err) =>{
      console.log(err)
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
          placeholder='아이디'/>
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
          placeholder='비밀번호'/>
        </div>
        <br />
        
        <button onClick ={handleLogin} className='bottomBtn'>확인</button>
      </div>
    </div>
  );
}

export default Login;
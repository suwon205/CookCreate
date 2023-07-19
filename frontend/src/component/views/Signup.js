import React, { useEffect, useState } from 'react';
import axios from 'axios';
import router from 'react-router-dom'
function Signup() {
    const [userId, setUserId] = useState('')
    const [userPw, setUserPw] = useState('')
    const [userPwCk, setUserPwCk] = useState('')
    const [nickName, setNickName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [userEmail, setUserEmail] = useState('')

    const handleSignup = (e) => {
        e.preventDefault()
        axios
        .post(`api/v1/auth/signup`, 
        {userId, userPw, userPwCk, nickName, phoneNumber, userEmail})
        .then((res) => {
            console.log(res)
            console.log('회원가입 완료!')
        })
        .catch((err) =>{
            console.log(err)
        })
        }
    return (
        <div className='page'>
            <div className='titleWrap'>
                회원가입을 <br />
                진행합니다.
            </div>
            <div className='contentWrap'>
                <div className='inputTitle'>아이디</div>
                <div className='inputWrap'>
                    <input type="text" className='input'
                    value={userId}
                    onChange={(e) =>{
                        setUserId(e.target.value)
                    }}/>
                </div>

                <div className='inputTitle'>비밀번호</div>
                <div className='inputWrap'>
                    <input type="password" className='input'
                    value={userPw}
                    onChange={(e) =>{
                        setUserPw(e.target.value)
                    }}/>
                </div>
                
                <div className='inputTitle'>비밀번호 확인</div>
                <div className='inputWrap'>
                    <input type="password" className='input'
                    value={userPwCk}
                    onChange={(e) =>{
                        setUserPwCk(e.target.value)
                    }}/>
                </div>

                <div className='inputTitle'>닉네임</div>
                <div className='inputWrap'>
                    <input type="nickname" className='input'
                    value={nickName}
                    onChange={(e) =>{
                        setNickName(e.target.value)
                    }}/>
                </div>

                <div className='inputTitle'>전화번호 입력</div>
                <div className='inputWrap'>
                    <input type="phonenumber" className='input'
                    value={phoneNumber}
                    onChange={(e) =>{
                        setPhoneNumber(e.target.value)
                    }}/>
                </div>

                <div className='inputTitle'>이메일</div>
                <div className='inputWrap'>
                    <input type="email" className='input'
                    value={userEmail}
                    onChange={(e) =>{
                        setUserEmail(e.target.value)
                    }}/>
                </div>

                <br/>

                <button onClick={handleSignup}
                 className="bottomBtn">회원가입</button>
            </div>
        </div>
    );
}

export default Signup;

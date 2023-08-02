import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { login } from '../../store/auth/auth'

import FoodList from './FoodList';
function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userId, setUserId] = useState('')
  const [userPw, setUserPw] = useState('')
  const [userPwCk, setUserPwCk] = useState('')
  const [nickname, setNickName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [food, setFood] = useState([]); // 이 부분에서 food와 setFood를 정의

  //오류 메세지 저장
  const [userIdMessage, setUserIdMessage] = useState('')
  const [userIdDupMessage, setUserIdDupMessage] = useState('')
  const [userPwMessage, setUserPwMessage] = useState('')
  const [userPwCkMessage, setUserPwCkMessage] = useState('')
  const [userNicknameMessage, setUserNicknameMessage] = useState('')
  const [userNNDupMessage, setUserNNDupMessage] = useState('')
  const [userCanSignUp, serUserCanSignUp] = useState('')
  const [userPhoneNumberMessage, setUserPhoneNumberMessage] = useState('')
  const [userEmailMessage, setUserEmailMessage] = useState('')
  //유효성 검사
  const [isUserId, setIsUserId] = useState(false)
  const [isIdDupli, setIsIddup] = useState(false)
  const [isUserPw, setIsUserPw] = useState(false)
  const [isUserPwCk, setIsUserPwCk] = useState(false)
  const [isNickname, setIsNickname] = useState(false)
  const [isNicknameDupli, setIsNNdup] = useState(false)
  const [isPhoneNumber, setIsPhoneNumber] = useState(false)
  const [isUserEmail, setIsUserEmail] = useState(true)

  //유효성 검사 구현
  const onChangeUserId = async (e) => {
    const value = e.target.value;
    await setUserId(value)
    if (value.length < 4 || value.length > 10) {
      setUserIdMessage('4글자 이상 10글자 이하로 입력해주세요')
      setIsUserId(false)
    } else {
      setUserIdMessage('적합한 아이디 형식입니다! 🤗')
      setIsUserId(true)
    }
  }
  const onChangeUserPw = async (e) => {
    const value = e.target.value;
    await setUserPw(value)
    if (value.length < 4 || value.length > 16) {
      setUserPwMessage('4글자 이상 16글자 이하로 입력해주세요')
      setIsUserPw(false)
    } else {
      setUserPwMessage('형식이 올바른 비밀번호입니다!')
      setIsUserPw(true)
    }
    if (userPwCk === '') {
      setUserPwCkMessage('')
      setIsUserPwCk(false)
    } else if (value === userPwCk) {
      setUserPwCkMessage('비밀번호가 동일합니다! 😊')
      setIsUserPwCk(true)
    } else {
      setUserPwCkMessage('비밀번호가 틀립니다!')
      setIsUserPwCk(false)
    }
  }
  const onChangeUserPwCk = async (e) => {
    const value = e.target.value;
    await setUserPwCk(value)
    if (value === '') {
      setUserPwCkMessage('')
      setIsUserPwCk(false)
    } else if (userPw === value) {
      setUserPwCkMessage('비밀번호가 동일합니다! 😊')
      setIsUserPwCk(true)
    } else {
      setUserPwCkMessage('비밀번호가 틀립니다!')
      setIsUserPwCk(false)
    }
  }
  const onChangeUserNickName = async (e) => {
    const value = e.target.value
    await setNickName(value)
    if (value.length < 2 || value.length > 8) {
      setUserNicknameMessage('2글자 이상 8글자 이하로 입력해주세요')
      setIsNickname(false)
    } else {
      setUserNicknameMessage('적합한 닉네임 형식입니다! 🤗')
      setIsNickname(true)
    }
  }
  const onChangeUserPhonenumber = async (e) => {
    const value = e.target.value
    await setPhoneNumber(value)
    const phoneRegex = /^(01[016789]{1})[0-9]{3,4}[0-9]{4}$/
    if (phoneRegex.test(value)) {
      setIsPhoneNumber(true)
      setUserPhoneNumberMessage('올바른 전화번호 형식입니다!')
    } else {
      setIsPhoneNumber(false)
      setUserPhoneNumberMessage('올바르지 않은 전화번호 형식입니다.')
    }
  }

  const onChangeUserEmail = async (e) => {
    const value = e.target.value
    const emailRegex = /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    await setUserEmail(value)
    if (value === '') {
      setIsUserEmail(true)
      setUserEmailMessage('')
    } else if (emailRegex.test(value)) {
      setIsUserEmail(true);
      setUserEmailMessage('올바른 이메일 형식입니다!');
    } else {
      setIsUserEmail(false);
      setUserEmailMessage('올바른 이메일 형식을 입력하세요');
    }
  };

  //중복 체크 로직
  const idDupliCheck = () => {
    axios
    .get(`api/v1/auth/checkId/${userId}`)
    .then((res) => {
      setUserIdDupMessage(res.data.message)
      setIsIddup(true)
    })
    .catch((err) => {
      setUserIdDupMessage(err.response.data.message)
      setIsIddup(false)
    })
  }
  const nicknameDupliCheck = () => {
    axios
    .get(`api/v1/auth/checkNick/${nickname}`)
    .then((res) => {
      setUserNNDupMessage(res.data.message)
      setIsNNdup(true)
    })
    .catch((err) => {
      setUserNNDupMessage(err.response.data.message)
      setIsNNdup(false)
    })
  }
  // 쿠키 / 쿠커 구현 로직
  const role = localStorage.getItem('userType')

  // 음식 선택 로직. props로 소통
  const handleSelectedFood = (selectedFood) => {
    if (food.includes(selectedFood)) {
      setFood(food.filter(item => item !== selectedFood))
    } else {
      setFood([...food, selectedFood])
    }
  };
  


  const handleSignup = (e) => {
    e.preventDefault()
    const foodString = food.join(',');
    console.log(food, foodString)
    axios
    .post(`api/v1/auth/signup`, 
    {userId, userPw, userPwCk, nickname, phoneNumber, userEmail, role, food})
    .then(() => {
      console.log(role) 
      navigate("/")
      axios.post(`api/v1/auth/login`, {
        userId,
        userPw
      })
      .then((res)=>{
        localStorage.removeItem('userType')
        dispatch(login({
          access_token : res.headers.access_token,
          refresh_token : res.headers.refresh_token,
          userId,
          nickname : res.data.nickname,
          role : res.data.role}));
        navigate("/")
      })
      .catch((err) =>{
        console.log(err.response.data.message)
      })
    })
    .catch((err) =>{
      serUserCanSignUp(err.response.data.message)
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
          onChange={
            onChangeUserId
          }
          placeholder='아이디'/>
          <button onClick={idDupliCheck}>중복 확인</button>
          <div>
            {userIdMessage}
            {userIdDupMessage}
          </div>
        </div>

        <div className='inputTitle'>비밀번호</div>
        <div className='inputWrap'>
          <input type="password" className='input'
          value={userPw}
          onChange={
            onChangeUserPw
          }
          placeholder='비밀번호'
          />
          <div>
            {userPwMessage}
          </div>
        </div>
            
        <div className='inputTitle'>비밀번호 확인</div>
        <div className='inputWrap'>
          <input type="password" className='input'
          value={userPwCk}
          onChange={
            onChangeUserPwCk
          }
          placeholder='비밀번호 확인'
          />
          <div>
            {userPwCkMessage}
          </div>
        </div>


        <div className='inputTitle'>닉네임</div>
        <div className='inputWrap'>
          <input type="nickname" className='input'
          value={nickname}
          onChange={
            onChangeUserNickName
          }
          placeholder='닉네임'/>
          <button onClick={nicknameDupliCheck}>중복확인</button>
          <div>
            {userNicknameMessage}
            {userNNDupMessage}
          </div>
        </div>

        <div className='inputTitle'>전화번호 입력</div>
        <div className='inputWrap'>
          <input type="phonenumber" className='input'
          value={phoneNumber}
          onChange={
            onChangeUserPhonenumber
          }
          placeholder='전화번호 입력'/>
          <div>
            {userPhoneNumberMessage}
          </div>
        </div>

        <div className='inputTitle'>이메일(선택사항)</div>
        <div className='inputWrap'>
          <input type="email" className='input'
          value={userEmail}
          onChange={
            onChangeUserEmail
          }
          placeholder='이메일'/>
          <div>
            {userEmailMessage}
          </div>
        </div>

        <br/>
        <FoodList selectedFood={food} toggleFood={handleSelectedFood} />
        <button onClick={handleSignup}
          className="bottomBtn"
          disabled={
            !(
              isUserId &&
              isIdDupli &&
              isUserPw &&
              isUserPwCk &&
              isNickname &&
              isNicknameDupli &&
              isPhoneNumber &&
              isUserEmail
            )
          }>
          회원가입
        </button>
      </div>
      {userCanSignUp}
    </div>
  );
}

export default Signup;
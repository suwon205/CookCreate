import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useSelector, useDispatch } from "react-redux";
import '../../style/navbar.css'
import { initOVSession, setIsSessionOpened, setOvToken, setRoomPresent, setSessionId, setVideoLessonId } from '../../store/video/video';
import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';

function NavBar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLogin = useSelector((state) => state.auth.isLogin)
  const refresh_token = localStorage.getItem('refresh_token')
  const access_token = localStorage.getItem('access_token')

  const nickname = localStorage.getItem('nickname')
  const role = localStorage.getItem('role')
  const emoji = localStorage.getItem('emoji')

  const OvToken = useSelector((state) => state.video.OvToken)
  const sessionId = useSelector((state) => state.video.sessionId)
  const videoLessonId = useSelector((state) => state.video.videoLessonId)
  // const roomPresent = useSelector((state) => state.video.roomPresent)
  const session = useSelector((state) => state.video.session)
  const isSessionOpened = useSelector((state) => state.video.isSessionOpened)

  const [ myLessons, setMyLessons ] = useState(undefined)  // 학생 모달창에 불러서 쓸 레슨 정보

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

  /* 선생님이 과외방 생성하는 코드 */
  // 선생님 마이페이지 생기면 옮기기

  // 수업 목록에서 생성하기 버튼을 클릭하면 세션이 생성되고 등등
  const createRoom = ( lessonId ) => {
    // 0. 레슨아이디 스토어에 저장
    dispatch(setVideoLessonId({videoLessonId: lessonId}))
  }

  /** 학생이 과외방 입장하는 코드 */
  const joinLesson = ( lessonId ) => {
    console.log("쿠키 입장 요청")
    dispatch(setVideoLessonId({videoLessonId: lessonId}))
  }
  
  // 1. 레슨아이디가 잘 저장되면 선생님이 해당 수업 방 만들기 요청 보내기
  useEffect(() => {
    if (videoLessonId !== undefined) {
      console.log(videoLessonId, "레슨번호")
      console.log("토큰", access_token)
      if (role === 'COOKYER') {
        axios.post(
          `api/v1/session/create`,
          { 'lessonId': videoLessonId },
          {
            headers: {
              access_token: access_token
            }
          })
          .then((res) => {
            // dispatch(setRoomPresent({roomPresent: true}))
            // console.log('방 만들기 요청 성공', res)
            console.log('쿠커 토큰 생성 성공', res)
            const sessionId = res.data.token
            // dispatch(setOvToken(token))
            dispatch(setSessionId({sessionId}))
            // dispatch(setMySessionId(res.data)) // 토큰이랑 커넥션 설정하는걸로 바꾸기?
          })
          .catch((err) => {
            console.log('쿠커 토큰 생성 실패', err)
          })
      } else if (role === 'COOKIEE') {
        // 레슨아이디가 등록되면 학생은 토큰 생성 요청
        console.log("쿠키 토큰 요청")
        axios.post(
          `api/v1/session/create`,
          { 'lessonId': videoLessonId },
          {
            headers : {
              Access_Token : access_token
            }
          })
          .then((res) => {
            console.log('쿠키 토큰 생성 성공', res.data)
            const sessionId = res.data.token
            dispatch(setSessionId({sessionId}))
          })
          .catch((err) => {
            console.log('쿠키 토큰 생성 실패', err)
          })
      }
    } else {
      console.log("레슨아이디 없음")
    }
      
  }, [videoLessonId])

  // 2. 토큰이 생기면 이동 OV, session 객체 생성
  useEffect(() => {
    if (sessionId) {
      const newOV = new OpenVidu()
      const newSession = newOV.initSession()
      dispatch(initOVSession({OV: newOV, session: newSession}))
    }
  }, [sessionId])

  // 3. 세션이 생기면 방 열렸다 체크 / 쿠키는 바로 입장
  // useEffect(() => {
  //   if (session !== undefined) {
  //     navigate(`/videoLesson/${role}`)
  //   }
  // }, [session])

  useEffect(() => {
    if (session) {
      if (role === 'COOKYER') {
        console.log("방 생김")
        dispatch(setIsSessionOpened({isSessionOpened: true}))
      } else if (role === 'COOKIEE') {
        if (sessionId) {
          navigate(`/videoLesson/${role}`)
        } else {
          console.log("쿠키 세션아이디 없어서 입장 불가")
        }
      } else {
        console.log("너 누구야")
      }
    }
  }, [session])

  // **4.
  useEffect(() => {
    if (isSessionOpened && role === 'COOKYER') {
      console.log(isSessionOpened, "방이 열렸어요")
      if (sessionId) {
        navigate(`/videoLesson/${role}`)
      }
    }
  }, [isSessionOpened])


  // useEffect(() => {  // 레슨 정보 받아오는 부분
  //   if (role === 'COOKIEE') {
  //     axios.get(
  //       `api/v1/my/applied`,
  //       {
  //         headers : {
  //           accessToken : access_token
  //         }
  //       })
  //       .then((res) => {
  //         console.log(res)
  //         console.log('신청한 수업 목록 받아와짐')
  //         setMyLessons(res.data) // 토큰이랑 커넥션 설정하는걸로 바꾸기?
  //         // setSessionId(res.data.sessionId)
  //       })
  //       .catch((err) => {
  //         console.log(err)
  //         console.log('신청한 수업 목록 안받아와짐')
  //       })
  //   }
  // }, [])

  return (
    <div style={{ display: 'flex', alignItems: 'center' }} className='navbar'>
      <Link to='/mypageS'>
        학생my
      </Link> |
      <Link to='/mypageT'>
        선생my
      </Link> |
      <Link to='/'>
        로고
      </Link> |
      <Link to='/lesson'>
        수업 전체
      </Link>
      
      <SearchBar />
      {isLogin ? (
        <div>
          {role} {emoji}
          {nickname}님, 안녕하세요!
          {/* 쿠커들에게만 보입니다. */}
          {role === 'COOKYER' ? <Link to='registerlesson'>과외 등록</Link> : null} 
          <span onClick={Logout}>로그아웃</span>
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
      {role === 'COOKYER' ? <button onClick={() => createRoom(3)}>쿠커화면</button> : null}
      {role === 'COOKIEE' ? <button onClick={() => joinLesson(3)}>쿠키화면</button> : null}
    </div>
  );
}

export default NavBar;

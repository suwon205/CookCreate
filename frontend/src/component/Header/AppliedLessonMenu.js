import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { initOVSession, setSessionId, setVideoLessonId } from '../../store/video/video';
import { useDispatch, useSelector } from 'react-redux';
import { OpenVidu } from 'openvidu-browser';
import { useNavigate } from 'react-router-dom';

function AppliedLessonMenu() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const access_token = localStorage.getItem('access_token')
  const role = localStorage.getItem('role')
  const sessionId = useSelector((state) => state.video.sessionId)
  const session = useSelector((state) => state.video.session)

  const [ myLessons, setMyLessons ] = useState(undefined)  // 학생 모달창에 불러서 쓸 레슨 정보
  const videoLessonId = useSelector((state) => state.video.videoLessonId)


  useEffect(() => {  // 레슨 정보 받아오는 부분  // 누를때마다 요청되므로 나중에 스토어에 저장하던지 위치 바꿔주기
    if (access_token) {
      axios.get(
        `api/v1/my/applied`,
        {
          headers : {
            Access_Token : access_token
          }
        })
        .then((res) => {
          console.log(res.data)
          console.log('신청한 수업 목록 받아와짐')
        if (res.data[0].message !== "신청한 과외가 없습니다.") {
          setMyLessons(res.data)
        } else {
          setMyLessons(undefined)
        }

        })
        .catch((err) => {
          console.log(err)
          console.log('신청한 수업 목록 안받아와짐')
        })
    }
  }, [access_token])

  /** 학생이 과외방 입장하는 코드 */
  const joinLesson = (lessonId) => {
    console.log("쿠키 입장 요청", lessonId)
    dispatch(setVideoLessonId(lessonId))
  }

  // 1. 레슨아이디가 잘 저장되면 선생님이 해당 수업 방 만들기 요청 보내기
  useEffect(() => {
    if (videoLessonId !== undefined) {
      console.log(videoLessonId, "레슨번호", access_token, "토큰")
      // 레슨아이디가 등록되면 학생은 토큰 생성 요청
      console.log("쿠키 세션아이디 요청")
      axios.post(
        `api/v1/session/create`,
        { 'lessonId': videoLessonId },
        {
          headers : {
            Access_Token : access_token
          }
        })
        .then((res) => {
          console.log('쿠키 세션아이디 생성 성공', res.data)
          const sessionId = res.data.token
          dispatch(setSessionId(sessionId))
        })
        .catch((err) => {
          console.log('쿠키 세션아이디 생성 실패', err)
        })  
    } else {
      console.log("레슨아이디 없음")
    }
  }, [videoLessonId])

  // 2. 세션아이디가 생기면 이동. OV, session 객체 생성
  useEffect(() => {
    if (sessionId) {
      const newOV = new OpenVidu()
      const newSession = newOV.initSession()
      dispatch(initOVSession({OV: newOV, session: newSession}))
    }
  }, [sessionId])

  useEffect(() => {
    if (session) {
      if (sessionId) {
        navigate(`/videoLesson/${role}`)
      } else {
        console.log("쿠키 세션아이디 없어서 입장 불가")
      }
    }
  }, [session])

  return (
    <div className='dropdown-content'>
      {myLessons ? (
        myLessons.map((lesson, i) => (
          <div key={lesson.lessonId}>
            <p>{lesson.lessonTitle}</p>
            <p>{lesson.cookyerName}</p>
            {lesson.sessionId === null ? (
              <button disabled='disabled'>수업예정</button>
            ) : (
              <button onClick={() => joinLesson(lesson.lessonId)}>참여하기</button>
            )}
          </div>
        ))
      ) : (
        <p>신청한 수업이 없습니다.</p>
      )}
    </div>
  );
}

export default AppliedLessonMenu;
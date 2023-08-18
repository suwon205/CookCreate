import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { initOVSession, setSessionId, setVideoLessonId } from '../../store/video/video';
import { useDispatch, useSelector } from 'react-redux';
import { OpenVidu } from 'openvidu-browser';
import { useNavigate } from 'react-router-dom';
import '../../style/appliedLessonMenu.css'

function AppliedLessonMenu({ myLessons }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const access_token = localStorage.getItem('access_token')
  const role = localStorage.getItem('role')
  const sessionId = useSelector((state) => state.video.sessionId)
  const session = useSelector((state) => state.video.session)

  const videoLessonId = useSelector((state) => state.video.videoLessonId)

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
          <div key={lesson.lessonId} className="drop-lesson">
            <div>
              <div className="drop-title">{lesson.lessonTitle}</div>
              <div>{lesson.cookyerName}</div>
            </div>
            {lesson.sessionId === null ? (
              <button disabled='disabled' className="drop-lesson-btn">과외예정</button>
            ) : (
              <button onClick={() => joinLesson(lesson.lessonId)} className={`drop-lesson-btn drop-lesson-btn-active`}>참여하기</button>
            )}
          </div>
        ))
      ) : (
        <p>신청한 과외가 없습니다.</p>
      )}
    </div>
  );
}

export default AppliedLessonMenu;
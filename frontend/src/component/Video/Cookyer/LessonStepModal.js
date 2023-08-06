import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { leaveSession } from '../../../store/video/video';
import LessonStep from './LessonStep';
import { initCookyerVideo } from '../../../store/video/cookyerVideo';
import { initVideoLessonInfo } from '../../../store/video/videoLessonInfo';
import { initScreenShare } from '../../../store/video/screenShare';

function LessonStepModal() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const lessonStepList = useSelector((state) => state.videoLessonInfo.lessonStepList)
  const access_token = localStorage.getItem('access_token')
  const videoLessonId = useSelector((state) => state.video.videoLessonId)

  const session = useSelector((state) => state.video.session)
  const [ isStoreStep, setIsStoreStep ] = useState(false)

  const storeLessonStepList = () => {
    console.log("단게 수정 최종 완료", lessonStepList, videoLessonId)
    axios.put(
      `/api/v1/step`,
      { 'lessonId': videoLessonId, 'lessonStepList': lessonStepList },
      {
        headers : {
          Access_Token : access_token
        }
      })
      .then((res) => {
        console.log('쿠커 진행단계 디비 업데이트 성공', res.data)
        setIsStoreStep(true)
        // dispatch(leaveSession())  // 스토어에 화상과외 관련 데이터 초기화
        // dispatch(initCookyerVideo())
        // dispatch(initVideoLessonInfo())
        // dispatch(initScreenShare())
      })
      .catch((err) => {
        console.log('쿠커 진행단계 디비 업데이트 실패', err)
      })
  }

  useEffect(() => {
    if (isStoreStep) {
      // 스토어에 정보가 잘 지워졌는지 확인 후 이동하고 싶은데 수정해야 할듯
      navigate('/')
      dispatch(leaveSession())  // 스토어에 화상과외 관련 데이터 초기화
      dispatch(initCookyerVideo())
      dispatch(initVideoLessonInfo())
      dispatch(initScreenShare())
    }
  }, [session, isStoreStep])

  return (
    <div className='cookyer-lesson-step-modal'>
      <h1>진행단계 확인</h1>
      {lessonStepList.map((step) => (
        <LessonStep
          key={step.stepOrder}
          stepOrder={step.stepOrder}
          stepContent={step.stepContent}
        />
      ))}
      <button onClick={storeLessonStepList}>완료</button>
    </div>
  );
}

export default LessonStepModal;
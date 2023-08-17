import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { leaveSession } from '../../../store/video/video';
import LessonStep from './LessonStep';
import { initCookyerVideo } from '../../../store/video/cookyerVideo';
import { initVideoLessonInfo } from '../../../store/video/videoLessonInfo';
import { initScreenShare } from '../../../store/video/screenShare';
import '../../../style/video/videoModals.css'

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
      })
      .catch((err) => {
        console.log('쿠커 진행단계 디비 업데이트 실패', err)
      })
  }

  useEffect(() => {
    if (isStoreStep) {
      // 스토어에 정보가 잘 지워졌는지 확인 후 이동하고 싶은데 수정해야 할듯
      navigate('/classlistT')
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (document.fullscreenElement) {
        document
          .exitFullscreen()
          .then(() => console.log("Document Exited from Full screen mode"))
          .catch((err) => console.error(err));
      }
      dispatch(leaveSession())  // 스토어에 화상과외 관련 데이터 초기화
      dispatch(initCookyerVideo())
      dispatch(initVideoLessonInfo())
      dispatch(initScreenShare())
    }
  }, [session, isStoreStep])

  return (
    <div className='cookyer-lesson-step-modal'>
      <div className='cookyer-lesson-step-modal-title-wrapper'>
        <p className='cookyer-lesson-step-modal-title'>요리 진행 단계 확인</p>
        <div className='cookyer-lesson-step-modal-desc'>
          <p>쿠키 레시피북에 들어갈 요리 진행 단계를 마지막으로 확인해 주세요.</p>
          <p>*수정하고 싶은 진행단계를 클릭하면 수정할 수 있습니다.</p>
        </div>
      </div>
      <div className='cookyer-lesson-step-modal-steps'>
        {lessonStepList ? (
          lessonStepList.map((step) => (
            <LessonStep
              key={step.stepOrder}
              stepOrder={step.stepOrder}
              stepContent={step.stepContent}
            />
          ))
        ) : null}
      </div>
      <div className='cookyer-lesson-step-modal-btn'>
        <button onClick={storeLessonStepList}>완료</button>
      </div>
    </div>
  );
}

export default LessonStepModal;
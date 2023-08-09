import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCheckCookiee, setCheckCookieeList } from '../../../store/video/cookyerVideo';
import { setCurIdx, setCurStep, setLessonStepList } from '../../../store/video/videoLessonInfo';

import { BsFillPersonCheckFill } from "react-icons/bs"
import { GoChevronLeft, GoChevronRight } from "react-icons/go"

function CookyerLessonStep() {
  const dispatch = useDispatch()
  const checkCookieeList = useSelector((state) => state.cookyerVideo.checkCookieeList)
  const [ checkCount, setCheckCount ] = useState(0)
  const publisher = useSelector((state) => state.video.publisher)
  const subscribers = useSelector((state) => state.video.subscribers)

  const lessonStepList = useSelector((state) => state.videoLessonInfo.lessonStepList)
  const curStep = useSelector((state) => state.videoLessonInfo.curStep)
  const curIdx = useSelector((state) => state.videoLessonInfo.curIdx)
  const totalSteps = useSelector((state) => state.videoLessonInfo.totalSteps)
  const [ isUpdate, setIsUpdate ] = useState(false)
  const [ inputStep, setInputStep ] = useState(curStep)

  useEffect(() => {
    if (curStep) {
      setInputStep(curStep)
    }
  }, [curStep])

  const goPrevStep = () => {
    if (lessonStepList && totalSteps && curIdx - 1 >= 0) {
      dispatch(setCurIdx(curIdx-1))
    }
  }

  const goNextStep = () => {
    if (lessonStepList && totalSteps && curIdx + 1 <= totalSteps) {
      dispatch(setCurIdx(curIdx+1))
    }
  }

  useEffect(() => {
    console.log("curStep 설정")
    dispatch(setCurStep("수업이 시작하면 진행 단계를 표시해주세요."))
  }, [])

  useEffect(() => {
    if (curIdx) {
      if (curIdx === 0) {
        dispatch(setCurStep("수업이 시작하면 진행 단계를 표시해주세요."))
      } else {
        if (lessonStepList) {
          const newStep = lessonStepList.find((step) => step.stepOrder === curIdx)
          dispatch(setCurStep(newStep.stepContent))
        }
      }
    }
  }, [curIdx, lessonStepList])

  useEffect(() => {
    if (curStep && publisher) {
      /** 진행단계 넘길때마다 쿠키에게 시그널 */
      const data = {
        curStep, curIdx
      }
      publisher.stream.session.signal({
        data: JSON.stringify(data),
        type: 'changeStep'
      })
    }
  }, [curStep, curIdx, publisher])

  const handleIsUpdate = () => {
    setIsUpdate((prev) => !prev)
  }

  const updateStepContent = () => {
    dispatch(setCurStep(inputStep))
    console.log("진행단계 엽데이트")
    const updateLessonStepList = lessonStepList.map((step) => {
      if (step.stepOrder === curIdx) {
        return { ...step, stepContent: inputStep}
      }
      return step
    })
    console.log("업데이트된 진행단계들", updateLessonStepList)
    dispatch(setLessonStepList(updateLessonStepList))
    setIsUpdate(false)
  }

  const handleInputChange = (e) => {
    setInputStep(e.target.value)
  }

  const resetCheckCookiee = (publisher) => {
    dispatch(setCheckCookieeList([]))
    setCheckCount(0)
    dispatch(setCheckCookiee(''))
    // 학생들에게도 리셋 시그널 보내야 함
    publisher.stream.session.signal({
      type: 'resetCheck'
    })
  }

  useEffect(() => {
    if (checkCookieeList !== undefined && checkCookieeList !== []) {
      setCheckCount(checkCookieeList.length)
    }
  }, [checkCookieeList])

  return (
    <div className='video-step-widget-cookyer'>
      <p className='video-step-title'>현재 진행 단계</p>
      <div className='video-step-main'>
        <GoChevronLeft onClick={goPrevStep}/>
        <div>
          {curStep ? (
            <div>
              {isUpdate ? (
                <div className='video-step-content'>
                  <div className='video-step-content-update'>
                    <p>{curIdx}. </p>
                    <input value={inputStep} onChange={handleInputChange}></input>
                  </div>
                  <button onClick={updateStepContent}>완료</button>
                </div>
              ) : (
                curIdx > 0 ? (
                  <div className='video-step-content'>
                    <p>{curIdx}. {curStep}</p>
                    <button onClick={handleIsUpdate}>수정</button>
                  </div>
                ) : (
                  <div className='video-step-content'>
                    <p>{curIdx}. {curStep}</p>
                    <button>수정</button>
                  </div>
                )
              )}
            </div>
          ) : (
            <p>현재 요리 단계</p>
          )}
        </div>
        <GoChevronRight onClick={goNextStep}/>
      </div>
      <div className='video-step-check-btn'  onClick={() => resetCheckCookiee(publisher)}>
        <div className='video-step-check-btn-wrap'>
          <BsFillPersonCheckFill className='video-step-check-icon'/>
          <div className='video-step-check-count'>
            <p>{checkCount}</p>
            <p>/</p>
            <p>{subscribers.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookyerLessonStep;
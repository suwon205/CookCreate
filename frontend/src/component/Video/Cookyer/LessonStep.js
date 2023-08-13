import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLessonStepList } from '../../../store/video/videoLessonInfo';

function LessonStep({ stepOrder, stepContent }) {
  const dispatch = useDispatch()

  const lessonStepList = useSelector((state) => state.videoLessonInfo.lessonStepList)

  const [ isUpdate, setIsUpdate ] = useState(false)
  const [ inputStep, setInputStep ] = useState(stepContent)

  // useEffect(() => {
  //   if (stepContent) {
  //     setInputStep(stepContent)
  //   }
  // }, [stepContent])

  const handleInputChange = (e) => {
    setInputStep(e.target.value)
  }

  const updateStepContent = () => {
    console.log("진행단계 엽데이트")
    const updateLessonStepList = lessonStepList.map((step) => {
      if (step.stepOrder === stepOrder) {
        return { ...step, stepContent: inputStep}
      }
      return step
    })
    console.log("업데이트된 진행단계들", updateLessonStepList)
    dispatch(setLessonStepList(updateLessonStepList))
    setIsUpdate(false)
  }
  
  const handleIsUpdate = () => {
    setIsUpdate((prev) => !prev)
  }

  /** textarea 디자인 관련 */
  const DEFAULT_HEIGHT = 24
  // const textareaRef = useRef(null)
  
  // useEffect(() => {
  //   if (textareaRef) {
  //     console.log(textareaRef)
  //   }
  //   if (textareaRef && textareaRef.current) {
  //     console.log(textareaRef.current)
  //     textareaRef.current.style.height = DEFAULT_HEIGHT + textareaRef.current.scrollHeight + 'px'
  //   }
  // }, [textareaRef, textareaRef.current])

  const setTextareaHeight = (e) => {
    console.log(e)
    const $target = e.target

    $target.style.height = 0
    $target.style.height = DEFAULT_HEIGHT + $target.scrollHeight + 'px'
  }

  return (
    <div className='cookyer-lesson-step-modal-container'>
    {isUpdate ? (
      <div className='cookyer-lesson-step-modal-step'>
        <p className='cookyer-lesson-step-modal-step-order'>{stepOrder}.</p>
        {/* <textarea ref={textareaRef} rows={1} className='cookyer-lesson-step-modal-step-content' value={inputStep} onChange={handleInputChange}></textarea> */}
        <textarea id='cookyer-step-textarea' onInput={(e) => setTextareaHeight(e)} className='cookyer-lesson-step-modal-step-content' value={inputStep} onChange={handleInputChange}></textarea>
        <button onClick={updateStepContent}>완료</button>
      </div>
    ) : (
      <div className='cookyer-lesson-step-modal-step' onClick={handleIsUpdate}>
        <p className='cookyer-lesson-step-modal-step-order'>{stepOrder}.</p>
        <p className='cookyer-lesson-step-modal-step-content'>{inputStep}</p>
        {/* <button onClick={handleIsUpdate}>수정</button> */}
      </div>
    )}
    </div>
  );
}

export default LessonStep;
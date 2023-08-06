import React, { useState } from 'react';
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

  return (
    <div className=''>
      {isUpdate ? (
        <div>
          <p>{stepOrder}</p>
          <input value={inputStep} onChange={handleInputChange}></input>
          <button onClick={updateStepContent}>완료</button>
        </div>
      ) : (
        <div>
          <p>{stepOrder}</p>
          <p>{inputStep}</p>
          <button onClick={handleIsUpdate}>수정</button>
        </div>
      )}
    </div>
  );
}

export default LessonStep;
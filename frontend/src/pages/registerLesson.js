import React, { useEffect, useState } from 'react';
import LessonStep from '../component/RegisterLesson/LessonStep';
import LessonInfoTop from '../component/RegisterLesson/LessonInfoTop';
import LessonTime from '../component/RegisterLesson/LessonTime';
import LessonDetail from '../component/RegisterLesson/LessonDetail';
import RegisterForm from '../component/RegisterLesson/RegisterForm';
import { useDispatch } from 'react-redux';
import PreviousLesson  from '../component/RegisterLesson/PreviousLesson'
import { resetlessonReducer } from '../store/lesson/lesson';
import AlertModal from '../component/Modal/AlertModal';
import '../style/lesson/registerLessonCss.css';

function RegisterLesson() {
  const dispatch = useDispatch();
  const [ content, setContent ] = useState('')
  const [ showAlert, setShowAlert ] = useState(false)
  const [ path, setPath ] = useState(null)

  useEffect(() => {
    dispatch(resetlessonReducer())
  }, []) // 페이지 렌더링시 lessonReducer 초기화
  return (
    <div>
      <div className='registerLessonTitleContainer'>
        <div className='registerLessonTitle'>
          과외 개설하기
        </div>
        <PreviousLesson/>
      </div>
      <LessonInfoTop/>
      <LessonTime/>
      <LessonDetail/>
      <LessonStep/>
      <br />
      <RegisterForm setContent={setContent} setShowAlert={setShowAlert} setPath={setPath}/>
      {showAlert ? (
        <AlertModal content={content} path={path} actions={setShowAlert} data={false}/>
      ) :  null}
    </div>
  );
}

export default RegisterLesson;
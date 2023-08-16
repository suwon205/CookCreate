import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  setLessonTitle, setCategory, setTimeTaken,
  setPrice, setMaximum, setDifficulty, setDescription, 
  setMaterials, setLessonStepList, setVideoUrl
  } from '../../store/lesson/lesson';
import '../../style/lesson/previousLessonCss.css';
import AlertModal from '../Modal/AlertModal';

function PreviousLesson() {
  const dispatch = useDispatch()
  const access_token = localStorage.getItem('access_token');
  const [showModal, setShowModal] = useState(false);

  const [showFailModal, setShowFailModal] = useState(false)

  const handlePreviousLesson = () => {
    setShowModal(true);
  };

  const confirmRegistration = () => {
    axios
      .get(`api/v1/lesson/latest`, {
        headers: {
          Access_Token: access_token,
        },
      })
      .then((res) => {
        dispatch(setLessonTitle(res.data.lessonTitle))
        dispatch(setCategory(res.data.categoryId))
        dispatch(setTimeTaken(res.data.timeTaken))
        dispatch(setPrice(res.data.price))
        dispatch(setMaximum(res.data.maximum))
        dispatch(setDifficulty(res.data.difficulty))
        dispatch(setDescription(res.data.description))
        dispatch(setMaterials(res.data.materials))
        dispatch(setLessonStepList(res.data.lessonStepList))
        dispatch(setVideoUrl(res.data.videoUrl))
        setShowModal(false);
      })
      .catch((err) => {
        console.log(err);
        setShowModal(false);
        setShowFailModal(true)
      });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      {showFailModal && <AlertModal content='최근에 예약한 과외 내역이 없습니다.' path={null} actions={setShowFailModal} data={false}/>}
      <div 
        className='previousLessonTitle'
        onClick={handlePreviousLesson}
      >최근 예약 내역 불러오기</div>

      {showModal && (
        <div className="alert-modal">
          <div className="alert-content-container">
            <div className='alert-content'>최근에 예약한 과외 내역을<br/>불러오시겠습니까?</div>
            <div className='alert-button-container'>
              <button className='alert-button' onClick={confirmRegistration}>예</button>
              <button className='alert-cancel-button' onClick={closeModal}>아니오</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PreviousLesson;
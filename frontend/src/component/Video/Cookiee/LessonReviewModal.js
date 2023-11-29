import React, { useState } from 'react';
import LessonReviewContent from './LessonReviewContent';
import AlertModal from '../../Modal/AlertModal';

function LessonReviewModal() {
  const [ showModal, setShowModal ] = useState(false)
  const [ failModal, setFailModal ] = useState(false)

  return (
    <div className='cookiee-lesson-review-modal'>
      {showModal && <AlertModal content='리뷰가 등록되었습니다.' path={-1}/>}
      {failModal && <AlertModal content='리뷰 등록에 실패했습니다. 마이페이지에서 다시 확인해주세요.' path={-1}/>}
      <div className='cookyer-lesson-step-modal-title-wrapper'>
        <p className='cookyer-lesson-step-modal-title'>리뷰 쓰기</p>
      </div>
      <div>
        <LessonReviewContent setShowModal={setShowModal} setFailModal={setFailModal}/>
      </div>
    </div>
  );
}

export default LessonReviewModal;
import React from 'react';
import LessonReviewContent from './LessonReviewContent';

function LessonReviewModal() {

  return (
    <div className='cookiee-lesson-review-modal'>
      <div className='cookyer-lesson-step-modal-title-wrapper'>
        <p className='cookyer-lesson-step-modal-title'>리뷰 쓰기</p>
      </div>
      <div>
        <LessonReviewContent/>
      </div>
    </div>
  );
}

export default LessonReviewModal;
import React from 'react';
import LessonReviewContent from './LessonReviewContent';

function LessonReviewModal() {

  return (
    <div className='cookiee-lesson-review-modal'>
      <h1>리뷰 쓰기</h1>
      <div>
        <LessonReviewContent/>
      </div>
    </div>
  );
}

export default LessonReviewModal;
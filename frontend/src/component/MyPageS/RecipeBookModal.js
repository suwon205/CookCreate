import React from 'react';
import '../../style/video/videoModals.css'

function RecipeBookModal({ lessonStepList, handleShowRecipe }) {

  return (
    <div className='cookyer-lesson-step-modal'>
      <div className='cookyer-lesson-step-modal-title-wrapper'>
        <p className='cookyer-lesson-step-modal-title'>레시피</p>
      </div>
      <div className='cookyer-lesson-step-modal-steps'>
        <div className='cookyer-lesson-step-modal-container'>
          {lessonStepList ? (
            lessonStepList.map((step) => (
              <div className='cookyer-lesson-step-modal-step'>
                <p className='cookyer-lesson-step-modal-step-order'>{step.stepOrder}.</p>
                <p className='cookyer-lesson-step-modal-step-content'>{step.stepContent}</p>
              </div>
            ))
          ) : null}
        </div>
      </div>
      <div className='cookyer-lesson-step-modal-btn'>
        <button onClick={() => handleShowRecipe({showRecipe: false, recipe: null})}>확인</button>
      </div>
    </div>
  );
}

export default RecipeBookModal;
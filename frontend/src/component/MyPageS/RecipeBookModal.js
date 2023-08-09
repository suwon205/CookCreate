import React from 'react';

function RecipeBookModal({ lessonStepList, handleShowRecipe }) {

  return (
    <div className='recipe-book-modal'>
      <h1>레시피</h1>
      {lessonStepList.map((step) => (
        <p>{step.stepOrder}. {step.stepContent}</p>
      ))}
      <button onClick={() => handleShowRecipe(false)}>확인</button>
    </div>
  );
}

export default RecipeBookModal;
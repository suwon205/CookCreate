import React from 'react';

function RecipeBookModal({ lessonStepList, handleShowRecipe }) {

  return (
    <div className='recipe-book-modal'>
      <h1>레시피</h1>
      {lessonStepList ? (
        lessonStepList.map((step) => (
          <p>{step.stepOrder}. {step.stepContent}</p>
        ))
      ) : null}
      <button onClick={() => handleShowRecipe({showRecipe: false, recipe: null})}>확인</button>
    </div>
  );
}

export default RecipeBookModal;
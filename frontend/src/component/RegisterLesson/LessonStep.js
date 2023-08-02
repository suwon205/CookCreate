import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLessonStepList, setStepValid } from '../../store/lesson/lesson';

function LessonStep() {
  const dispatch = useDispatch();
  const [stepList, setStepList] = useState([{ stepOrder: 1, stepContent: '' }]);
  const [errMsg, setErrMsg] = useState('');
  const stepValid = useSelector((state) => state.lesson.stepValid);

  const handleChange = (index, value) => {
    const updatedList = [...stepList];
    updatedList[index] = { ...updatedList[index], stepContent: value };
    setStepList(updatedList);
  };

  const handleAddInput = () => {
    if (stepList[stepList.length - 1].stepContent.trim() === '') {
      setErrMsg('마지막 단계를 채워주세요.');
      return;
    }
    setStepList((prevList) => [
      ...prevList,
      {
        stepOrder: prevList.length + 1,
        stepContent: '',
      },
    ]);
    setErrMsg('');
  };

  const handleRemoveInput = (index) => {
    if (stepList.length > 1) {
      setStepList((prevList) => {
        const updatedList = prevList
          .filter((_, i) => i !== index)
          .map((step, i) => ({
            ...step,
            stepOrder: i + 1,
          }));
        return updatedList;
      });
    }
  };

  const checkStepContentFilled = useCallback(() => {
    return stepList.every((step) => step.stepContent.trim() !== '');
  }, [stepList]); // 의존성 배열에 stepList 추가

  useEffect(() => {
    dispatch(setLessonStepList(stepList));
    dispatch(setStepValid(checkStepContentFilled()));
  }, [dispatch, stepList, checkStepContentFilled]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h3>진행 단계</h3>
        <div style={{ marginLeft: '5px' }}>{stepValid ? '✅' : '🔲'}</div>
      </div>
      <div>
        {stepList.map((step, index) => (
          <div key={index}>
            <input
              type="text"
              value={step.stepContent}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={`요리 진행 단계를 입력하세요`}
            />
            {stepList.length > 1 && (
              <button onClick={() => handleRemoveInput(index)}>삭제</button>
            )}
          </div>
        ))}
        <button onClick={handleAddInput}>+</button>
        {errMsg && <p>{errMsg}</p>}
        <p>{checkStepContentFilled() ? '모든 단계가 찼습니다.' : '단계를 모두 입력해주세요.'}</p>
      </div>
    </div>
  );
}

export default LessonStep;
import React from 'react';
import { useSelector } from 'react-redux';

function CookieeLessonStep() {
  const curStep = useSelector((state) => state.videoLessonInfo.curStep)
  const curIdx = useSelector((state) => state.videoLessonInfo.curIdx)

  return (
    <div>
      <div>
        <p>현재 진행 단계</p>
        <div>
          {curStep ? (
            <div>
              <p>{curIdx}</p>
              <p>{curStep}</p>
            </div>
          ) : (
            <p>진행 단계</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CookieeLessonStep;
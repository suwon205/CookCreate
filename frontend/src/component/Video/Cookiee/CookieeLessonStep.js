import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

function CookieeLessonStep({ size }) {
  const curStep = useSelector((state) => state.videoLessonInfo.curStep)
  const curIdx = useSelector((state) => state.videoLessonInfo.curIdx)

  useEffect(() => {
    console.log(curStep, '변화함')
  }, [curStep])

  return (
    <div className={`${size}-video-step-widget-cookiee`}>
      <p className={`${size}-video-step-title-cookiee`}>현재 진행 단계</p>
      <div className={`${size}-video-step-content-cookiee`}>
        {curIdx !== 0 ? (
            <p>{curIdx}. {curStep}</p>
        ) : (
          <p>0. 수업이 시작되면 진행 단계가 표시됩니다.</p>
        )}
      </div>
    </div>
  );
}

export default CookieeLessonStep;
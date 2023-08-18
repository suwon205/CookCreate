import React, { useState } from 'react';
import { useSelector } from 'react-redux';

function VideoHeader({ size }) {
  const lessonTitle = useSelector((state) => state.videoLessonInfo.lessonTitle)
  const cookyerName = useSelector((state) => state.videoLessonInfo.cookyerName)
  const curIdx = useSelector((state) => state.videoLessonInfo.curIdx)
  const totalSteps = useSelector((state) => state.videoLessonInfo.totalSteps)

  return (
    <div className={`${size}-video-header`}>
      <div className={`${size}-video-header-left`}>
        {lessonTitle ? (
          <p className={`${size}-video-lesson-title`}>{lessonTitle}</p>
        ) : (
          <p className={`${size}-video-lesson-title`}>과외 제목</p>
        )}
        {cookyerName ? (
          <p className={`${size}-video-lesson-cookyer`}>{cookyerName}</p>
        ) : (
          <p className={`${size}-video-lesson-cookyer`}>쿠커 이름</p>
        )}
      </div>
      {size === 'full' ? (
        <div className={`${size}-video-header-right`}>
          <div className={`${size}-video-lesson-progress`}>
            <p>진행률</p>
            <progress value={curIdx} max={totalSteps}></progress>
            <p>{curIdx} / {totalSteps}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default VideoHeader;
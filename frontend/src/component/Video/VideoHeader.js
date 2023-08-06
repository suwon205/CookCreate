import React, { useState } from 'react';
import { useSelector } from 'react-redux';

function VideoHeader() {
  const lessonTitle = useSelector((state) => state.videoLessonInfo.lessonTitle)
  const cookyerName = useSelector((state) => state.videoLessonInfo.cookyerName)
  const curIdx = useSelector((state) => state.videoLessonInfo.curIdx)
  const totalSteps = useSelector((state) => state.videoLessonInfo.totalSteps)

  return (
    <div className='video-header'>
      <div className='video-header-left'>
        {lessonTitle ? (
          <p className='video-lesson-title'>{lessonTitle}</p>
        ) : (
          <p className='video-lesson-title'>수업 제목</p>
        )}
        {cookyerName ? (
          <p className='video-lesson-cookyer'>{cookyerName}</p>
        ) : (
          <p className='video-lesson-cookyer'>쿠커 이름</p>
        )}
      </div>
      <div className='video-header-right'>
        <div className='video-lesson-time'>
          <p>진행시간</p>
          <p>0:30:47</p>
        </div>
        <div className='video-lesson-progress'>
          <p>진행률</p>
          <progress value={curIdx-1} max={totalSteps}></progress>
          <p>{curIdx} / {totalSteps}</p>
        </div>
      </div>
    </div>
  );
}

export default VideoHeader;
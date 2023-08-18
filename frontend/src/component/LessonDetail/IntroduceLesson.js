import React from 'react';
import { useSelector } from 'react-redux';
import '../../style/lesson/introduceLessonCss.css';

function IntroduceLesson() {
  const description = useSelector((state) => state.lessonInfo.description)
  const materials = useSelector((state) => state.lessonInfo.materials)
  return (
    <div className='introduceLessonContainer'>
      <div className='introduceLessonTitle'>과외 소개</div>
      <div className='introduceLessonDescription'>
        {description}
      </div>
      <div className='introduceLessonMateTitle'>준비물</div>
      <div className='introduceLessonMateDesc'>다음과 같은 재료가 필요합니다.</div>
      <div className='introduceLessonMateItems'>
        {materials ? (
          materials.map((item, index) => (
            <div className='introduceLessonMateItem' key={index}>
              {item},
            </div>
          ))
        ) : null}
      </div>
    </div>
  );
}

export default IntroduceLesson;
import React from 'react';
import { useSelector } from 'react-redux';
import '../../style/lesson/lesson-schedule-css.css';

function LessonSchedule() {
  const lessonDate = useSelector((state) => state.lessonInfo.lessonDate)
  const timeTaken = useSelector((state) => state.lessonInfo.timeTaken)

  const displayTime = (dateTime) => {
    if (!dateTime) return null;

    const [datePart, timePart] = dateTime.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');

    const meridiem = Number(hour) >= 12 ? '오후' : '오전';
    const formattedHour = (Number(hour) % 12) || 12; // 12시는 12로 표시
    const formattedTime = `${meridiem} ${formattedHour}:${minute}`;

    return `${year}.${month}.${day}. ${formattedTime}`;
  };

  return (
    <div className='lessonScheduleContainer'>
      <div className='lessonScheduleRowContainer'>
        <div className='lessonScheduleFirstTitle'>학습 일정</div>
        <div className='lessonScheduleFirstDesc'>{displayTime(lessonDate)}</div>
      </div>
      <div className='lessonScheduleRowContainer'>
        <div className='lessonScheduleSecondTitle'>학습 시간</div>
        <div className='lessonScheduleSecondDesc'>{timeTaken}분</div>
      </div>
    </div>
  );
}

export default LessonSchedule;

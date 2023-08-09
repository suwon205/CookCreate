import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import 'react-datepicker/dist/react-datepicker.css';
import { setDateTime, setDateValid, setTimeTaken, setTimeTakenVaild } from "../../store/lesson/lessonEdit";

function EditLessonTime() {
  const dispatch = useDispatch()
  const lessonData = useSelector((state) => (state.lessonInfo.lessonData))
  const [initDateTime, setInitDateTime] = useState('')
  const initTimeTaken = useSelector((state) => state.lessonInfo.timeTaken)
  const [selectedDateTime, setSelectedDateTime] = useState(initDateTime)
  const [lessonTakenTime, setLessonTakenTime] = useState(initTimeTaken)

  //유효성 검사
  const dateValid = useSelector((state) => state.lessonEdit.dateValid)
  const timeTakenValid = useSelector((state) => state.lessonEdit.timeTakenValid)

  useEffect(() => {
    if (lessonData) {
      setInitDateTime(new Date(lessonData))
    }
  }, [lessonData])
  
  const handleDateTimeChange = (date) => {
    setSelectedDateTime(date)
  };

  const handleTakenTime = (e) => {
    setLessonTakenTime(e.target.value)
    dispatch(setTimeTakenVaild(e.target.value !== ''))
    dispatch(setTimeTaken(e.target.value))
  };

  useEffect(() => {
    if (selectedDateTime !== "") {
      const isoDateTime = selectedDateTime.toISOString(); // ISO 8601 변환
      dispatch(setDateTime(isoDateTime));
      const currentDate = new Date();
      const futureTime = new Date(currentDate.getTime() + 12 * 60 * 60 * 1000); // 현재 시간 + 12시간

      if (selectedDateTime > futureTime) {
        dispatch(setDateValid(true));
      } else {
        dispatch(setDateValid(false));
      }
    }
  }, [dispatch, selectedDateTime, lessonTakenTime]);
  

  return (
    <div style={{display : 'flex', alignItems : 'center'}}>
      <div>
        <div style={{display : 'flex', alignItems : 'center'}}>
          <h3>강의 일시</h3>
          <div style={{marginLeft : '5px'}}>{dateValid ? '✅' : '🔲'}</div>
        </div>
        <DatePicker
          selected={selectedDateTime}
          onChange={handleDateTimeChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={30}
          dateFormat="yyyy-MM-dd HH:mm"
          placeholderText='과외 일시'
        />
        {selectedDateTime && dateValid === false && <p style={{ color: 'red' }}>
          강의 시간은 현재보다 12시간 이전일 수 없습니다.
          <br/>
          올바른 날짜를 선택해주세요.</p>}


      </div>
      <div>
        <div style={{display : 'flex', alignItems : 'center'}}>
          <h3>강의 시간</h3>
          <div style={{marginLeft : '5px'}}>{timeTakenValid ? '✅' : '🔲'}</div>
        </div>
        <select value={lessonTakenTime} onChange={handleTakenTime}>
          <option value="">-</option>
          <option value="60">60분</option>
          <option value="90">90분</option>
          <option value="120">120분</option>
          <option value="150">150분</option>
          <option value="180">180분</option>
          <option value="210">210분</option>
          <option value="240">240분</option>
        </select>
      </div>
    </div>
  );
}

export default EditLessonTime;

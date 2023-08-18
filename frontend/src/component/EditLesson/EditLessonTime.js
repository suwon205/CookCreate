import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import 'react-datepicker/dist/react-datepicker.css';
import { setTimeTaken, setTimeTakenVaild } from "../../store/lesson/lessonEdit";
import "../../style/lesson/editLessonTime.css";

function EditLessonTime() {
  const dispatch = useDispatch();
  const initlessonDate = useSelector((state) => state.lessonEdit.lessonDate);
  const initTimeTaken = useSelector((state) => state.lessonEdit.timeTaken);
  const [lessonDate, setLessonDate] = useState("");
  const [lessonTakenTime, setLessonTakenTime] = useState(initTimeTaken);

  // 유효성 검사
  const handleTakenTime = (e) => {
    setLessonTakenTime(e.target.value);
    dispatch(setTimeTakenVaild(e.target.value !== ""));
    dispatch(setTimeTaken(e.target.value));
  };
  useEffect(() => {
    setLessonTakenTime(initTimeTaken);
    setLessonDate(initlessonDate);
  }, [initTimeTaken, initlessonDate]);

  const formatAMPM = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "오후" : "오전";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");
    return `${ampm} ${displayHours}:${displayMinutes}`;
  };

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  let formattedDate = ""; // 초기화

  if (lessonDate !== "") {
    formattedDate = new Intl.DateTimeFormat("ko-KR", options).format(
      new Date(lessonDate)
    );
  }

  return (
    <div className="edit-info-top-container">
      <div className="edit-info-top-title-container">
        <div className="edit-info-text">
          <span>과외 일시</span>
          <span className="required">*</span>
          <div className="edit-info-mate-desc">
            과외 일시는 수정할 수
            <br />
            없습니다.
          </div>
        </div>
        <p className="edit-form-cannot-edit">{formattedDate}</p>
      </div>
      <div>
        <div className="edit-info-top-title-container">
          <div className="edit-info-text">
            <span>예상 소요 시간</span>
            <span className="required">*</span>
            <div className="edit-info-mate-desc">
              예상 소요 시간은 수정할 수
              <br />
              없습니다.
            </div>
          </div>
          <p className="edit-form-cannot-edit">{lessonTakenTime} 분</p>
        </div>
      </div>
    </div>
  );
}

export default EditLessonTime;

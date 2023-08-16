import React, { useEffect, useState } from "react";
import FoodCategory from "./FoodCategory";
import { useDispatch, useSelector } from "react-redux";
import { setLessonTitle, setTitleValid } from "../../store/lesson/lesson";
import '../../style/lesson/lessonInfoTopCss.css';

function LessonInfoTop() {
  const dispatch = useDispatch();
  const [lessonTitle, sLessonTitle] = useState("");
  const titleValid = useSelector((state) => state.lesson.titleValid)
  const reduxLessonTitle = useSelector((state) => state.lesson.lessonTitle)
  const titleChange = (e) => {
    const titleValue = e.target.value;
    dispatch(setLessonTitle(titleValue));
    sLessonTitle(titleValue);
  };

  useEffect(() => {
    sLessonTitle(reduxLessonTitle)
    dispatch(setTitleValid(lessonTitle.trim() !== ""));
  }, [reduxLessonTitle, lessonTitle])

  const inputClassName = titleValid ? "lessonInfoInput valid" : "lessonInfoInput";

  return (
    <div className="lessonInfoTopContainer">
      <FoodCategory />
      <div className="lessonInfoTopTitleContainer">
        <div className="lessonInfoText">
          과외 제목 
          <span className="required">*</span>
        </div>
        <input
          className={inputClassName}
          type="text"
          value={lessonTitle}
          onChange={titleChange}
          placeholder="과외 제목을 입력해주세요."
        />
      </div>
    </div>
  );
}

export default LessonInfoTop;
import React, {useEffect, useState} from 'react';
import FoodCategory from "./FoodCategory";
import { useDispatch, useSelector } from "react-redux";
import { setLessonTitle, setTitleValid } from "../../store/lesson/lessonEdit";
import '../../style/lesson/lessonEditInfoTop.css';

function EditLessonDetail() {
  const dispatch = useDispatch();
  const initLessonTitle = useSelector((state) => state.lessonEdit.lessonTitle)
  const titleValid = useSelector((state) => state.lessonEdit.titleValid)
  
  const [lessonTitle, setLessonTitleState] = useState('');
  
  useEffect(() => {
    setLessonTitleState(initLessonTitle);
  }, [initLessonTitle]);

  const inputClassName = titleValid ? "lessonInfoInput valid" : "lessonInfoInput";

  const titleChange = (e) => {
    const titleValue = e.target.value;
    setLessonTitleState(titleValue);
    dispatch(setLessonTitle(titleValue));
    dispatch(setTitleValid(titleValue.trim() !== ""));
  };
  return (
    <div className='edit-info-top-container'>
      <FoodCategory />
      <div className='edit-info-top-title-container'>
        <div className='edit-info-text'>
          과외 제목
          <span className='required'>*</span>
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

export default EditLessonDetail;
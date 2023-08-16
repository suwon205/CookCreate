import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDeadLine, setOrder } from '../../store/lesson/lessonSearch';
import '../../style/lesson/lessonListFilterCss.css';

function LessonListFliter() {
  const dispatch = useDispatch();
  const [sortBy, setSortBy] = useState('title');
  const initDeadline = false
  const [deadlineCheck, setDeadlineCheck] = useState(initDeadline);
  const storeDeadline = useSelector((state) => state.lessonSearch.deadline)
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    dispatch(setOrder(event.target.value));
  };
  const handleDeadLine = () => {
    console.log(deadlineCheck, '체크라인 업뎃 전')
    // const shownCheckbox = ;
    setDeadlineCheck(!deadlineCheck);
    
    dispatch(setDeadLine(!storeDeadline));
    console.log(deadlineCheck, '체크라인 업뎃 후')
  };

  return (
    <div>
      <div className='sortSelectContainer'>
        <select
          className='sortSelect'
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="title">가나다순</option>
          <option value="date">마감임박순</option>
          <option value="price">가격순</option>
          <option value="avg">평점순</option>
          <option value="review">리뷰순</option>
        </select>
      </div>
      <div className='deadlineContainer'>
        <input
          type="checkbox"
          checked={deadlineCheck}
          onChange={handleDeadLine}
          className='deadlineCheckbox'
          id='deadlineCheckbox'
        />
        
        <label htmlFor='deadlineCheckbox' className='deadlineLabel'>
          마감 과외 보여주기
        </label>
      </div>
    </div>
  );
}

export default LessonListFliter;

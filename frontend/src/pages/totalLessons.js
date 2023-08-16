import React, { useEffect } from 'react';
import SearchBar from '../component/TotalLessons/SearchBar';
import LessonListFliter from '../component/TotalLessons/LessonListFliter';
import LessonList from '../component/TotalLessons/LessonList';
import LessonFoodCategory from '../component/TotalLessons/LessonFoodCategory';
import { useDispatch } from 'react-redux';
import { resetlessonSearch } from '../store/lesson/lessonSearch';
import { setLessonId } from '../store/lesson/lessonInfo';
import '../style/lesson/totalLessonsCss.css';

function TotalLessons() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetlessonSearch())
  })

  return (
    <div>
      <div>
        <h3 className='title'>
          수업 전체
        </h3>
        <div className='desc'>
          실력 있는 선생님들과 직접 나만의 요리를 완성해보세요!
        </div>
      </div>
      <div className='contentContainer'>
        <div className='mainContent'>
          <SearchBar/>
          <LessonFoodCategory/>
          <LessonList/>
        </div>
        <div className='sidebar'>
          <LessonListFliter/>
        </div>
      </div>
    </div>
  );
}

export default TotalLessons;

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCategories } from '../../store/lesson/lessonSearch';
import '../../style/lesson/lessonFoodCategoryCss.css';

const LessonFoodCategory = () => {
  const dispatch = useDispatch();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const foodCategories = [
    '한식', '양식', '중식', '일식', '아시안', '건강식', '디저트'
  ];

  const handleCategoryClick = (index) => {
    const categoryValue = index + 1;
    const isSelected = selectedCategories.includes(categoryValue);
    let updatedSelectedCategories;

    if (isSelected) {
      updatedSelectedCategories = selectedCategories.filter((val) => val !== categoryValue);
    } else {
      updatedSelectedCategories = [...selectedCategories, categoryValue];
    }

    setSelectedCategories(updatedSelectedCategories);

    // 인덱스 + 1 값을 문자열로 조합하여 Redux 스토어에 저장
    const selectedCategoriesStr = updatedSelectedCategories.join(',');
    dispatch(setCategories(selectedCategoriesStr));
  };

  return (
    <div className='categoryContainer'>
      {foodCategories.map((category, index) => (
        <div
        className={`categoryItem ${selectedCategories.includes(index + 1) ? 'selected' : ''}`}
          key={index}
          onClick={() => handleCategoryClick(index)}
        >
          {category}
        </div>
      ))}
    </div>
  );
};

export default LessonFoodCategory;

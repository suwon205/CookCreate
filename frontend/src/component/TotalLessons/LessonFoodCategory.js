import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCategories } from '../../store/lesson/lessonSearch';
import '../../style/lesson/lessonFoodCategoryCss.css';

const LessonFoodCategory = () => {
  const dispatch = useDispatch();
  const initCategory = useSelector((state) => state.lessonSearch.category);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    if (initCategory.length === 0) {
      setSelectedCategories([]);
    }
  }, [initCategory]);

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

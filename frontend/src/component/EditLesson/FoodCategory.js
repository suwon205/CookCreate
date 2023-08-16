import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategory, setCategoryValid } from "../../store/lesson/lessonEdit";

function FoodCategory() {
  const dispatch = useDispatch();
  const initCategory = useSelector((state) => state.lessonEdit.categoryId);
  const transformCategoryId = [
    "한식",
    "양식",
    "중식",
    "일식",
    "아시안",
    "건강식",
    "디저트",
  ];
  const initCategoryName = transformCategoryId[initCategory - 1];
  const [selectedCategory, setSelectedCategory] = useState(initCategory); // categoryId 저장

  const categories = useMemo(
    () => ["한식", "양식", "중식", "일식", "아시안", "건강식", "디저트"],
    []
  );
  const categoryValid = useSelector((state) => state.lessonEdit.categoryValid);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    dispatch(setCategoryValid(e.target.value !== ""));
  };

  useEffect(() => {
    dispatch(setCategory(selectedCategory));
  }, [dispatch, selectedCategory, categories]);
  useEffect(() => {
    setSelectedCategory(initCategory);
  }, [initCategory]);
  return (
    <div className="edit-info-top-category-container">
      <div className="edit-info-text">
        카테고리
        <span className="required">*</span>
      </div>
      <select
        className="edit-info-select"
        value={selectedCategory}
        onChange={handleCategoryChange}
      >
        <option value="">-</option>
        {categories.map((category, index) => (
          <option key={index} value={index + 1}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FoodCategory;

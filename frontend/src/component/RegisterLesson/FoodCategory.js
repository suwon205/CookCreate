import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategory, setCategoryValid } from "../../store/lesson/lesson";

function FoodCategory() {
  const dispatch = useDispatch();
  const reduxCategoryId = useSelector((state) => state.lesson.categoryId);
  const [selectedCategory, setSelectedCategory] = useState(""); // 카테고리 이름 저장
  const [selectedIndex, setSelectedIndex] = useState(""); // 카테고리 idx 저장

  const categories = useMemo(
    () => ["-", "한식", "양식", "중식", "일식", "아시안", "건강식", "디저트"],
    []
  );

  const handleCategoryChange = (e) => {
    const selectedIndex = e.target.selectedIndex;
    setSelectedIndex(selectedIndex);
    setSelectedCategory(categories[selectedIndex]); // 선택한 인덱스에 해당하는 카테고리 값을 저장
    dispatch(setCategory(selectedIndex));
  };

  useEffect(() => {
    setSelectedIndex(reduxCategoryId);
    setSelectedCategory(categories[reduxCategoryId]);
    dispatch(setCategoryValid(selectedIndex !== "" && selectedIndex !== 0));
  }, [reduxCategoryId, selectedCategory, selectedIndex]);

  return (
    <div className="lessonInfoTopCategoryContainer">
      <div className="lessonInfoText">
        카테고리
        <span className="required">*</span>
      </div>
      <select
        className="lessonInfoSelect"
        value={selectedCategory}
        onChange={handleCategoryChange}
      >
        {" "}
        {categories.map((category, index) => (
          <option key={index}>{category}</option>
        ))}
      </select>
    </div>
  );
}

export default FoodCategory;

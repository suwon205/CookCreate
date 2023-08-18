import React from "react";
import { setLessonId } from "../../store/lesson/lessonInfo";
import { useDispatch } from "react-redux";
import "../../style/lesson/lessonItemCss.css";
import defaultThumbnail from "../../assets/non-image.png";
function LessonItem({
  id,
  title,
  date,
  thumbnailUrl,
  reviewAvg,
  cookyerName,
  categoryId,
  difficulty,
}) {
  const dispatch = useDispatch();
  const handleItemClick = () => {
    dispatch(setLessonId(id));
  };

  const formattedDate = new Date(date);
  const options = { month: "2-digit", day: "2-digit", weekday: "short" };
  const formattedDateString = formattedDate.toLocaleDateString(
    "ko-KR",
    options
  );
  const convertCategoryId = [
    "한식",
    "양식",
    "중식",
    "일식",
    "아시안",
    "건강식",
    "디저트",
  ];
  const category = convertCategoryId[categoryId - 1];

  const currentTime = new Date();
  const futureTime = new Date(currentTime.getTime() + 12 * 60 * 60 * 1000); // 현재 시간 + 12시간

  let message = "";
  if (formattedDate < futureTime) {
    message = "앞으로 12시간 이내에 시작될 과외이므로, 신청 불가능합니다.";
  }

  return (
    <div onClick={handleItemClick} className="lessonItem">
      {thumbnailUrl ? (
        <img className="thumbnail" src={thumbnailUrl} alt="image" />
      ) : (
        <img className="thumbnail" src={defaultThumbnail} alt="image" />
      )}
      <h3 className="lessonItemTitle">{title}</h3>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="jjim">⭐ {reviewAvg}</div>
        <div className="datename">
          {formattedDateString} | {cookyerName}
        </div>
      </div>
      <div className="badgeContainer">
        <button className="categoryBadge">{category}</button>
        <button className="difficultyBadge">{difficulty}</button>
      </div>
      {message && <div className="messageOverlay">{message}</div>}
    </div>
  );
}

export default LessonItem;

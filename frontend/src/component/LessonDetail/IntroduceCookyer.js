import React from "react";
import { useSelector } from "react-redux";
import "../../style/lesson/introduceCookyerCss.css";

function IntroduceCookyer() {
  const cookyerName = useSelector((state) => state.lessonInfo.cookyerName);
  const food = useSelector((state) => state.lessonInfo.food);
  const introduce = useSelector((state) => state.lessonInfo.introduce);
  const badgeExist = useSelector((state) => state.lessonInfo.badge);
  const profileImg = useSelector((state) => state.lessonInfo.profileImg);
  const foodLabels = [
    "한식",
    "양식",
    "중식",
    "일식",
    "아시안",
    "건강식",
    "디저트",
  ];
  // 기본 프로필 사진
  const previewImage =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  return (
    <div className="introduceCookyerContainer">
      <div className="introduceCookyerTitle">선생님 소개</div>
      <div className="introduceCookyerNameContainer">
        {profileImg ? (
          <img className="introduceCookyerProfileImg" src={profileImg} alt="" />
        ) : (
          <img
            className="introduceCookyerProfileImg"
            src={previewImage}
            alt=""
          />
        )}{" "}
        <span className="introduceCookyerName">{cookyerName}</span>
        {food && food.length > 0 && (
          <div className="introduceCookyerFoodContainer">
            {food.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="separator"> | </span>}
                <span className="introduceCookyerFood">{foodLabels[item]}</span>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
      <div>
        {" "}
        {badgeExist === "O" && (
          <span className="introduceCookyerBadge">자격증 소지</span>
        )}{" "}
      </div>
      <div className="introduceCookyerIntroduce">{introduce}</div>
    </div>
  );
}

export default IntroduceCookyer;

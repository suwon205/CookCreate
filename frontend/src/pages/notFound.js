import React from "react";
import "../style/notFound.css";
import { LuArrowLeftCircle } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import NotFoundImage from "../assets/404image.png"; // 이미지 경로를 재확인해주세요
function NotFound() {
  const navigate = useNavigate();

  const handleBackArrow = () => {
    navigate(-1); // 뒤로 가기 실행
  };
  return (
    <div className="not-found-page-container">
      <div className="not-found-page">
        <div>죄송합니다. 요청하신 페이지를 찾을 수 없습니다.</div>
        <div
          onClick={handleBackArrow}
          style={{ display: "flex", alignItems: "center", marginTop : '10px' }}
        >
          <div>
            <LuArrowLeftCircle className="not-found-arrow" />
          </div>
          <div
            style={{
              marginLeft: "10px",
              fontSize: "20px",
              fontWeight: "initial",
            }}
          >
            뒤로가기
          </div>
        </div>
      </div>
      <div className="not-found-img-container">
        <img src={NotFoundImage} alt="Not Found" className="not-found-img" />
      </div>
    </div>
  );
}

export default NotFound;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../../style/lesson/lessonReviewCss.css";
import DecimalStar from "./DecimalStar";

function LessonReview() {
  const accessToken = localStorage.getItem("access_token");
  const lessonId = useSelector((state) => state.lessonInfo.lessonId);
  const [ReviewGrade, setReviewGrade] = useState("");
  const [Reviews, setReveiws] = useState([]);
  const [cookyerId, setCookyerId] = useState(null);

  const displayTime = (dateTime) => {
    if (!dateTime) return null;

    const localDate = new Date(dateTime);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Seoul", // 시간대를 UTC로 설정 (한국 시간으로 하는게 맞는 거 같다)
    };
    return localDate.toLocaleString("ko-KR", options)
    .replace(". ","-").replace(". ","-").replace("."," ");
  };

  useEffect(() => {
    if (ReviewGrade) {
      setCookyerId(ReviewGrade.cookyerId);
    }
  }, [ReviewGrade]);

  // const cookyerId = ReviewGrade.cookyerId;

  useEffect(() => {
    if (lessonId) {
      axios
        .get(`/api/v1/lesson/${lessonId}`, {
          headers: {
            Access_Token: accessToken,
          },
        })
        .then((res) => {
          console.log("리뷰평점1", res.data);
          setReviewGrade(res.data);
        })
        .catch((err) => {
          console.log("평점 에러", err);
        });
    }
  }, [lessonId]);

  console.log("리뷰평점2", ReviewGrade);
  console.log("쿠커아이디", cookyerId);

  //리뷰불러오기
  useEffect(() => {
    if (accessToken && cookyerId) {
      axios
        .get(`/api/v1/review/${cookyerId}`, {
          headers: {
            Access_Token: accessToken,
          },
        })
        .then((res) => {
          setReveiws(res.data);
        })
        .catch((err) => {
          console.log("리뷰에러", err);
        });
    }
  }, [accessToken, cookyerId]);

  console.log("리뷰리스트", Reviews);

  const previewImage =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  return (
    <div className="review-container">
      <div className="review-header">
        <div className="review-title">리뷰</div>
        {ReviewGrade.reviewCnt > 0 ? (
          <div className="review-avg-container">
            <div className="review-star">
              <DecimalStar rating={ReviewGrade.reviewAvg} iconSize="20px" />
            </div>
            <div className="review-avg">
              <div>{ReviewGrade.reviewAvg.toFixed(1)}/5.0</div>
            </div>
            <div className="review-cnt">
              <div>({ReviewGrade.reviewCnt}건)</div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="review-list">
        {ReviewGrade.reviewCnt > 0 ? (
          <div>
            {Reviews.map((content, reviewId) => (
              <div key={reviewId} className="review-item">
                <div className="review-info-wrap">
                <div>
                  {content.profileImg ? (
            <img className="review-profile-img" src={content.profileImg} alt="" />
          ) : (
            <img
              className="review-profile-img"
              src={previewImage}
              alt=""
            />
          )}{" "}  
                </div>
                <div className="review-text-wrap">
                  <div className="review-item-star"><DecimalStar rating={content.rating} iconSize="15px"/></div>
                  <div className="review-nickname">{content.nickname}</div>
                </div>
                </div>
                <div>
                  <div className="review-content">{content.reviewContents}</div>
                  <div className="review-date">{displayTime(content.modifiedDate)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-reviews">작성된 리뷰가 없습니다.</div>
        )}
      </div>
    </div>
  );
}

export default LessonReview;

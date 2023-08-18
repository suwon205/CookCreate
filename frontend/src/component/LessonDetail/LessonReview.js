import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import '../../style/lesson/lessonReviewCss.css';
import DecimalStar from "./DecimalStar";


function LessonReview() {
  const accessToken = localStorage.getItem("access_token");
  const lessonId = useSelector((state) => state.lessonInfo.lessonId);
  const [ReviewGrade, setReviewGrade] = useState("");
  const [Reviews, setReveiws] = useState([]);
  const [cookyerId, setCookyerId] = useState(null);



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

    return (
      <div className="review-container">
        <div className="review-header">
          <h3 className="review-title">리뷰</h3>
          {ReviewGrade.reviewCnt > 0 ? (
            <div className="review-avg-container">
              <div className="review-star" >
                <DecimalStar rating={ReviewGrade.reviewAvg} />
              </div>
              <div className="review-avg">
                <div>{ReviewGrade.reviewAvg.toFixed(1)}/5.0</div>
              </div>
              <div className="review-cnt">
                <div>
                  ({ReviewGrade.reviewCnt}건)
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="review-list">
          {ReviewGrade.reviewCnt > 0 ? (
            <div>
              {Reviews.map((content, reviewId) => (
                <div key={reviewId} className="review-item">
                  <div className="review-nickname">{content.nickname}</div>
                  <div className="review-content">{content.reviewContents}</div>
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


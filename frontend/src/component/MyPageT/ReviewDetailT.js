// import React from 'react'
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from 'axios';

//별점
import StarShow from "./StarShow";


export default function ReviewDetailT({ reviewId,onClose}) {
  const accessToken = useSelector((state) => state.auth.access_token);
  const [selectedReview, setSelectedReview] = useState("");


  useEffect(() => {
    handleViewDetail();
  },  [reviewId] );

  //시간 포맷
  const displayTime = (dateTime) => {
    if (!dateTime) return null;

    const localDate = new Date(dateTime);
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      // second: '2-digit',
      timeZone: 'Asia/Seoul', // 시간대를 UTC로 설정 (한국 시간으로 하는게 맞는 거 같다)
    };
    return localDate.toLocaleString(undefined, options);
  };

  
  //리뷰상세정보 조회
  const handleViewDetail = () => {
    axios
      .get(`api/v1/review/detail/${reviewId}`, {
        headers: {
          Access_Token: accessToken,
        },
      })
      .then((res) => {
        console.log("리뷰상세정보", res.data);
        setSelectedReview(res.data);
        console.log("selectedReview",selectedReview);
      })
      .catch((err) => {
        console.log("상세 정보 요청 실패", err);
      });
  };

   

  return (
    <div className="modal-content">
      <button type="submit" onClick={onClose}>❌</button>
    <h2 className="modal-title">리뷰 상세 정보</h2>
    <div className="review-details">
      <div className="review-field">
        <label htmlFor="lessonTitle">과외명:{selectedReview.lessonTitle}</label>
      </div>
      <div className="review-field">
        <label htmlFor="rating">평점:{selectedReview.rating}</label>
      </div>
      <div className="review-field">
        {/* <label htmlFor="rating">평점:{selectedReview.rating}</label> */}
        <StarShow rating={selectedReview.rating} size="1.4rem" color="gold" />
      </div>
      <div className="review-field">
        <label htmlFor="lessonTitle">선생님:{selectedReview.cookyerName}</label>
      </div>
      <div className="review-field">
        <label htmlFor="rating">작성자:{selectedReview.userId}({selectedReview.nickname})</label>
      </div>
      <div className="review-field">
        <label htmlFor="reviewContents">리뷰 내용:{selectedReview.reviewContents}</label>
      </div>
      <div className="review-field">
        {/* {selectedReview ? <div>생성일:{new Date(selectedReview.createdDate).toISOString().split("T")[0]}</div> : null} */}
        {/* <label htmlFor="reviewContents">생성날짜:{selectedReview.createdDate}</label> */}
        {selectedReview ? <label htmlFor="reviewContents"> 생성일:{displayTime(selectedReview.createdDate)}</label>: null}
      </div>
      <div className="review-field">
        {/* <label htmlFor="reviewContents">수정일:{selectedReview.modifiedDate}</label> */}
        {selectedReview ? <label htmlFor="reviewContents"> 수정일:{displayTime(selectedReview.modifiedDate)}</label>: null}
      </div>
    </div>
  </div>
);
}


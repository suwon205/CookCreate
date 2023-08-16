// import React from 'react'
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from 'axios';
import ReviewEdit from "./ReviewEdit";

//별점표시
import StarShow from "../MyPageT/StarShow";


export default function ReviewDetail({ reviewId,onClose}) {
  const accessToken = useSelector((state) => state.auth.access_token);
  const [selectedReview, setSelectedReview] = useState("");
  // const [editedReview, setEditedReview] = useState({ ...review });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  useEffect(() => {
    if (!isEditModalOpen) {
      handleViewDetail();
    }
  }, [isEditModalOpen]);
  // },  [reviewId] );

  
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

    // 리뷰 삭제
    const handleDeleteReview = () => {
      axios
        .delete(`api/v1/review/${reviewId}`, {
          headers: {
            Access_Token: accessToken,
          },
        })
        .then((res) => {
          console.log("리뷰 삭제 성공");
          alert("리뷰가 삭제 되었습니다.");
          onClose();
        })
        .catch((err) => {
          console.log("리뷰 삭제 실패", err);
        });
    };

  // 수정모달 열기
  const handleUpdateReview = () => {
    setIsEditModalOpen(true);
  }

  // 수정모달 닫기
  const handleCloseUpdateModal = () => {
    setIsEditModalOpen(false);
  }

  return (
    <div className="modal-content">
      <button type="submit" onClick={onClose}>❌</button>
    <h2 className="modal-title">리뷰 상세 정보</h2>
    
    
    <div className="review-details">
      <div className="review-field">
        <label htmlFor="lessonTitle">강의명: {selectedReview.lessonTitle}</label>
      </div>
      <div className="review-field">
        <label htmlFor="lessonTitle">선생님:{selectedReview.cookyerName}({selectedReview.cookyerId})</label>
      </div>
      <div className="review-field">
        <label htmlFor="rating">작성자:{selectedReview.nickname}</label>
      </div>
      <div className="review-field">
        {selectedReview ? <label htmlFor="reviewContents"> 생성일:{displayTime(selectedReview.createdDate)}</label>: null}
        {/* <label htmlFor="reviewContents">생성날짜: {selectedReview ? new Date(selectedReview.createdDate).toISOString().split("T")[0] : null}</label> */}
      </div>
      <div className="review-field">
        {selectedReview ? <label htmlFor="reviewContents"> 수정일:{displayTime(selectedReview.modifiedDate)}</label>: null}
        {/* <label htmlFor="reviewContents">수정날짜: {selectedReview ? new Date(selectedReview.modifiedDate).toISOString().split("T")[0] : null}</label> */}
      </div>
      {isEditModalOpen ? (
        <ReviewEdit
          selectedReview={selectedReview}
          onClose={handleCloseUpdateModal}
        />
      ) : (
        <div>
          <div>
            별점: {selectedReview.rating}
            <StarShow rating={selectedReview.rating} size="1.4rem" color="gold" />
          </div>
          <div>
            <label htmlFor="reviewContents">리뷰 내용: {selectedReview.reviewContents}</label>
          </div>
          <div className="review-actions">
            <button type="button" onClick={handleUpdateReview}>
              수정하기
            </button>
            <button type="button" onClick={handleDeleteReview}>
              삭제하기
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
);
}


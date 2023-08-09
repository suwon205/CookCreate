// import React from 'react'
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from 'axios';
import ReviewEdit from "./ReviewEdit";


export default function ReviewDetail({ reviewId,onClose}) {
  const accessToken = useSelector((state) => state.auth.access_token);
  const [selectedReview, setSelectedReview] = useState("");
  // const [editedReview, setEditedReview] = useState({ ...review });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  useEffect(() => {
    handleViewDetail();
  },  [reviewId] );

  
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
        <label htmlFor="lessonTitle">강좌 이름:{selectedReview.lessonTitle}</label>
      </div>
      <div className="review-field">
        <label htmlFor="lessonTitle">선생님 아이디:{selectedReview.cookyerId}/선생님 성함:{selectedReview.cookyerName}</label>
      </div>
      <div className="review-field">
        <label htmlFor="rating">평점:{selectedReview.rating}</label>
      </div>
      <div className="review-field">
        <label htmlFor="rating">유저아이디:{selectedReview.userId}/유저닉네임:{selectedReview.nickname}</label>
      </div>
      <div className="review-field">
        <label htmlFor="reviewContents">리뷰 내용:{selectedReview.reviewContents}</label>
      </div>
      <div className="review-field">
        <label htmlFor="reviewContents">생성날짜:{selectedReview ? new Date(selectedReview.createdDate).toISOString().split("T")[0] : null}</label>
      </div>
      <div className="review-field">
        <label htmlFor="reviewContents">수정날짜:{selectedReview ? new Date(selectedReview.modifiedDate).toISOString().split("T")[0] : null}</label>
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
    {isEditModalOpen && (
        <ReviewEdit
          selectedReview={selectedReview}
          onClose={handleCloseUpdateModal}
        />
      )}
  </div>
);
}


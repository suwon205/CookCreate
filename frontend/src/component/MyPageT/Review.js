import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import { useSelector } from "react-redux";
import axios from "axios";
import Modal from 'react-modal';
import ReviewDetailT from "./ReviewDetailT";

//별점
import StarShow from "./StarShow";



function Review() {
  const accessToken = useSelector((state) => state.auth.access_token);
  const cookyerId = useSelector((state) => state.auth.id);
  const [reviews, setReviews] = useState([]);
  const [grade, setGrade] = useState([]);
  const reviewsMessage = reviews[0]?.lessonId === 0 ? "받은 리뷰가 없습니다." : "";
  //모달관련
  const [selectedReviewId, setSelectedReviewId] = useState(null); // 선택된 리뷰의 reviewId
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleOpenModal = (reviewId) => {
    setSelectedReviewId(reviewId); // 선택한 리뷰의 reviewID저장
    setIsModalOpen(true);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    Modal.setAppElement("#root"); 
  }, []);




  //평점 불러오기
  useEffect(() => {
    axios
      .get(`api/v1/review/avg/${cookyerId}`, {
        headers: {
          Access_Token: accessToken,
        },
      })
      .then((res) => {
        setGrade(res.data);
        console.log("평점", grade);
      })
      .catch((err) => {
        console.log("평점에러", err);
      });
  }, [accessToken]);

  //리뷰불러오기
  useEffect(() => {
    axios
      .get(`api/v1/review/${cookyerId}`, {
        headers: {
          Access_Token: accessToken,
        },
      })
      .then((res) => {
        setReviews(res.data);
      })
      .catch((err) => {
        console.log("리뷰에러", err);
      });
  }, [accessToken]);

  return (
    <div>
      <SideBar />
      <section>
        <div className="header">
          <h2 className="header_title">받은 리뷰:{grade.count}개</h2>
          <h2 className="section_title">평균별점:{grade.avg}</h2>
          <div></div>
        </div>
        <ul className="caution_list">
          <div className="caution_list_item">
            <div></div>
          </div>
        </ul>
        <section className="review">
          {reviewsMessage ? (
            <div className="noreview">{reviewsMessage}</div>
          ) : (
            reviews.map((review) => (
              <div className="review_item" key={review.id}>
                <div className="review_box">
                  <div className="review_cont">
                    <a href="dd" className="review_link">
                      {review.lessonTitle}
                    </a>
                    {/* <div className="review_star">⭐️⭐️⭐️⭐️ {review.rating}</div> */}
                    <StarShow rating={review.rating} size="1.4rem" color="gold" />
                    <div className="review_author">작성자/아이디: {review.userId}</div>
                    <div className="review_tutor">
                      선생님닉네임/아이디: {review.cookyerName}/{review.cookyerId}
                    </div>
                    <div className="review_cont">
                      리뷰내용:{review.reviewContents}
                      <div className="review_cont">{review.content}</div>
                    </div>
                    <div className="review_fun">
                      <button type="button" className="review_btn" onClick={() =>handleOpenModal(review.reviewId)}>
                        <i className="review_icon">🔍</i>
                        <span className="review_btn_txt">자세히보기</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal}>
            <ReviewDetailT reviewId={selectedReviewId} onClose={handleCloseModal} />
          </Modal>
        </section>
      </section>
    </div>
  );
}

export default Review;

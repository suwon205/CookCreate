import React, { useState, useEffect } from "react";
import "../../style/review.css";
import SideBar from "./SideBar";
import axios from "axios";
import { useSelector } from "react-redux";
import ReviewDetail from "./ReviewDetail";
import Modal from 'react-modal';

//별점표시
import StarShow from "../MyPageT/StarShow";



function Review() {
  const accessToken = useSelector((state) => state.auth.access_token);
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null); // 선택된 리뷰의 reviewId 



  // const [selectedReview, setSelectedReview] = useState(null);
  //모달리뷰
  // const [showModal, setShowModal] = useState(false);

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



  //리뷰목록 불러오기
  useEffect(() => {
    axios
      .get(`api/v1/my/review`, {
        headers: {
          Access_Token: accessToken,
        },
      })
      .then((res) => {
        // console.log("리뷰목록",res.data);
        setReviews(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [accessToken,reviews]);

  

  return (
    <div>
      <SideBar />
      <section>
        <div className="header">
          <h2 className="header_title">작성한 리뷰</h2>
          {/* <h2 className="section_title"></h2> */}
        </div>
        <ul className="caution_list">
          <div className="caution_list_item">
            <div></div>
          </div>
        </ul>
        <div className="panel">
          <div className="ac-dropdown e-order-default my-likes__dropdown  hidden-default-icon">
            <select name="order" className="">
              <option value="published_date">최근 리뷰</option>
              <option value="title">오래된 순</option>
            </select>
          </div>
        </div>
        {reviews.map((review, index) => (
          <div key={index}>
            <section className="review">
              <div className="review_box">
                <div className="review_item">
                  <div className="review_cont">
                    <a href="dd" className="review_link">
                      강좌이름: {review.lessonTitle}
                    </a>
                    {/* <div className="review_star">⭐️⭐️⭐️⭐️ {review.rating}</div> */}
                    <StarShow rating={review.rating} size="1.4rem" color="gold" />
                    <div className="review_author">작성자:{review.userId}</div>
                    <div className="review_tutor">
                      선생님아이디/이름
                      {review.cookyerId}/{review.cookyerName}
                    </div>
                    <div className="review_cont">
                      리뷰내용
                      <div className="review_cont">{review.reviewContents}</div>
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
            </section>
          </div>
        ))}
      </section>
      <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal}>
        <ReviewDetail reviewId={selectedReviewId} onClose={handleCloseModal} />
        {/* <ReviewDetail reviewId={review.reviewId} onClose={handleCloseModal} /> */}
      </Modal>
    </div>
  );
}

export default Review;

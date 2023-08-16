import React, { useState, useEffect } from "react";
import "../../style/review.css";
import SideBar from "./SideBar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ReviewDetail from "./ReviewDetail";
import Modal from 'react-modal';

//별점표시
import StarShow from "../MyPageT/StarShow";
import { useNavigate } from "react-router";
import { setLessonId } from "../../store/lesson/lessonInfo";



function Review() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const accessToken = useSelector((state) => state.auth.access_token);
  const [reviews, setReviews] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null); // 선택된 리뷰의 reviewId 

  /** 이동할 과외 아이디 */
  const [ goLessonDetail, setGoLessonDetail ] = useState(false)
  const lessonId = useSelector((state) => state.lessonInfo.lessonId)

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
    console.log("리뷰목록 불러오기")
    if (accessToken) {
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
    }
  }, [accessToken]);

  const goLesson = (lessonId) => {
    setGoLessonDetail(true)
    dispatch(setLessonId(lessonId))
    navigate(`/lesson/${lessonId}`)
  }

  useEffect(() => {
    if (goLessonDetail && lessonId !== null) {
      navigate(`/lesson/${lessonId}`)
    }
  }, [lessonId])

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
        {reviews ? 
          reviews.map((review, index) => (
            <div key={index}>
              <section className="review">
                <div className="review_box">
                  <div className="review_item">
                    <div className="review_cont">
                      <div className="review_link" onClick={() => goLesson(review.lessonId)}>
                        과외명: {review.lessonTitle}
                      </div>
                      <StarShow rating={review.rating} size="1.4rem" color="gold" />
                      <div>{review.rating}</div>
                      <div className="review_author">작성자:{review.nickname}</div>
                      <div className="review_tutor">
                        선생님:
                        {review.cookyerName}
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
          )) : null
        }
      </section>
      <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal}>
        <ReviewDetail reviewId={selectedReviewId} onClose={handleCloseModal} />
        {/* <ReviewDetail reviewId={review.reviewId} onClose={handleCloseModal} /> */}
      </Modal>
    </div>
  );
}

export default Review;

import styled from "@emotion/styled";
import React, {useState,useEffect} from "react";
// import React, {useState} from "react";
import StarInput from "./StarInput";
import { useSelector } from "react-redux";
import axios from "axios";

const Base = styled.section`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Name = styled.span`
  font-size: 1.4rem;
  line-height: 100%;
`;

const RatingValue = styled.span`
  font-size: 1.2rem;
  line-height: 100%;
`;

const RatingField = styled.fieldset`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  border: none;
  transform: translateY(2px);

  input:checked ~ label,
  labeL:hover,
  labeL:hover ~ label {
    transition: 0.2s;
    color: orange;
  }
`;


function ReviewForm({onClose, onClickRating, reviewLessonData }) {

  const accessToken = useSelector((state) => state.auth.access_token);
  console.log(accessToken)
  const [reviewContents, setreviewContents] = useState("");
  const [rating, setRating] = useState("0");

  const lessonId = reviewLessonData.lessonId
  const lessonTitle = reviewLessonData.lessonTitle
  const cookyerName = reviewLessonData.cookyerName
  const thumbnailUrl = reviewLessonData.thumbnailUrl

  
  const handleClickRating = (value) => {
    console.log("별점",value)
    setRating(value);
    console.log(rating)
  };
  
  useEffect(() => {
    console.log("별점 변경됨", rating);
  }, [rating]);
  
  
  
  
  const data = {
    lessonId: parseInt(lessonId),
    rating: parseFloat(rating),
    reviewContents:reviewContents
  }



  const handleSubmit = (e) => {
    e.preventDefault();

    axios
    .post(`api/v1/review`, data, {
      headers: {
        Access_Token: accessToken,
      },
    })
    .then((res) => {
      console.log(res.data);
      alert('리뷰가 등록되었습니다.');
      onClose();
    })
    .catch((err) => {
      console.log("리뷰등록못함", err);
    });

  };



  return (
    <div className='cookiee-lesson-review-modal'>
      <div className='cookyer-lesson-step-modal-title-wrapper'>
        <p className='cookyer-lesson-step-modal-title'>리뷰 쓰기</p>
      </div>

      <div>
        <div className="cookiee-lesson-review-modal-info">
          <div className="cookiee-lesson-review-modal-img">
            {thumbnailUrl ? (
              <img src={thumbnailUrl} alt="과외 썸네일"/>
            ) : (
              <img src= "/logo.png" alt="로고" className='logo' />
            )}
          </div>
          <div className="cookiee-lesson-review-modal-p">
            <p className="cookiee-lesson-review-modal-title">{lessonTitle}</p>
            <p className="cookiee-lesson-review-modal-cookyer">{cookyerName}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="cookiee-lesson-review-modal-desc">
            <p>과외는 어떠셨나요?</p>
          </div>
          <div className="cookiee-lesson-review-modal-stars-wrapper">
            <Base>
              {/* <Name>별점</Name> */}
              <RatingField>
                <StarInput required
                  onClickRating={handleClickRating}
                  value={5.0}
                  isHalf={false}
                />
                <StarInput
                  onClickRating={handleClickRating}
                  value={4.5}
                  isHalf={true}
                />
                <StarInput
                  onClickRating={handleClickRating}
                  value={4.0}
                  isHalf={false}
                />
                <StarInput
                  onClickRating={handleClickRating}
                  value={3.5}
                  isHalf={true}
                />
                <StarInput
                  onClickRating={handleClickRating}
                  value={3.0}
                  isHalf={false}
                />
                <StarInput
                  onClickRating={handleClickRating}
                  value={2.5}
                  isHalf={true}
                />
                <StarInput
                  onClickRating={handleClickRating}
                  value={2}
                  isHalf={false}
                />
                <StarInput
                  onClickRating={handleClickRating}
                  value={1.5}
                  isHalf={true}
                />
                <StarInput
                  onClickRating={handleClickRating}
                  value={1}
                  isHalf={false}
                />
                <StarInput
                  onClickRating={handleClickRating}
                  value={0.5}
                  isHalf={true}
                />
              </RatingField>
              {/* <RatingValue>{rating}</RatingValue> */}
            </Base>
          </div>
          <div className="cookiee-lesosn-review-modal-textarea">
            <label htmlFor="reviewContents"></label>
            <textarea
              id="reviewContents"
              value={reviewContents}
              onChange={(e) => setreviewContents(e.target.value)}
              placeholder="쿠커와 과외에 대한 리뷰를 남겨주세요."
            />
          </div>
          <div className="cookiee-lesson-review-modal-btn">
            <button className="cookiee-lesson-review-modal-submit-btn" type="submit">등록</button>
            <button className="cookiee-lesson-review-modal-leave-btn" onClick={(e) => onClose(e)}>나가기</button>
          </div>
        </form>
      </div>

    </div>
  );
}
export default ReviewForm;
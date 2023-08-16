import React,{useState, useEffect} from "react";
import styled from "@emotion/styled";
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




function ReviewEdit({ onClose, selectedReview}) {
  const accessToken = useSelector((state) => state.auth.access_token);
  const [reviewContents, setreviewContents] = useState(selectedReview.reviewContents);
  const  [rating, setRating] = useState(selectedReview.rating);
  const reviewId = selectedReview.reviewId

  
  const handleClickRating = (value) => {
    console.log("별점",value)
    setRating(value);
    console.log(rating)
  };
  
  useEffect(() => {
    console.log("별점 변경됨", rating);
  }, [rating]);
  
  
  const data = {
    reviewId:parseInt(reviewId),
    rating: parseFloat(rating),
    reviewContents:reviewContents
  }

  
  //리뷰수정
  const handleSubmit = (e) => {
    e.preventDefault();

    //api
    axios
    .put(`api/v1/review`, data, {
      headers: {
        Access_Token: accessToken,
      },
    })
    .then((res) => {
      console.log(res.data);
      alert('리뷰가 수정되었습니다.');
      onClose();
    })
    .catch((err) => {
      console.log("리뷰수정못함", err);
    });

  };



  return (
    <div className="review_detail">
          <div>
      {/* <button type="submit" onClick={onClose}>❌</button>
      <h2>리뷰 수정</h2> */}
      <form onSubmit={handleSubmit}>
        {/* <div>
          <label htmlFor="lectureName">강의명:{selectedReview.lessonTitle}</label>
        </div> */}
        <div>
          <Base>
            <Name>별점</Name>
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
            <RatingValue>{rating}</RatingValue>
          </Base>
        </div>
        <div>
          <label htmlFor="reviewContents"></label>
          <textarea
            id="reviewContents"
            value={reviewContents}
            onChange={(e) => setreviewContents(e.target.value)}
          />
        </div>
        <button type="submit">수정</button>
        <button onClick={onClose}>취소</button>
      </form>
    </div>

    </div>
  );
}

export default ReviewEdit;
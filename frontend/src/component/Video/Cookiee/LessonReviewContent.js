import styled from "@emotion/styled";
import React, {useState,useEffect} from "react";
// import React, {useState} from "react";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router";
import StarInput from "../../MyPageS/StarInput";
import { initVideoLessonInfo } from "../../../store/video/videoLessonInfo";

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


function LessonReviewContent() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const access_token = localStorage.getItem('access_token')
  const [ reviewContents, setreviewContents ] = useState("");
  const [ rating, setRating ] = useState("0");
  const lessonId = useSelector((state) => state.videoLessonInfo.lessonId)

  const leaveClass = () => {
    dispatch(initVideoLessonInfo())
    navigate('/')
  }

  const handleClickRating = (value) => {
    console.log("별점",value)
    setRating(value);
    console.log(rating)
  };
  
  useEffect(() => {
    console.log("별점 변경됨", rating);
  }, [rating]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      lessonId: parseInt(lessonId),
      rating: parseFloat(rating),
      reviewContents: reviewContents
    }

    axios
    .post(`/api/v1/review`, data, {
      headers: {
        Access_Token: access_token,
      },
    })
    .then((res) => {
      console.log(res.data);
      dispatch(initVideoLessonInfo())
      navigate('/')
      alert('리뷰가 등록되었습니다.');
    })
    .catch((err) => {
      console.log("리뷰등록못함", err);
    });

  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="lectureName">과외id: {lessonId}</label>
        </div>
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
        <button type="submit">등록</button>
      </form>
      <button onClick={leaveClass}>나가기</button>
    </div>
  );
}
export default LessonReviewContent;
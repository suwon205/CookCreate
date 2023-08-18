import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';

import IntroduceLesson from "../component/LessonDetail/IntroduceLesson";
import IntroduceCookyer from "../component/LessonDetail/IntroduceCookyer";
import LessonReview from "../component/LessonDetail/LessonReview";
import CookieeNumber from "../component/LessonDetail/CookieeNumber";
import ApplyLesson from "../component/LessonDetail/ApplyLesson";
import LessonSchedule from "../component/LessonDetail/LessonSchedule";
import EditLesson from "../component/LessonDetail/EditLesson";
import {
  setCategoryId,
  setCategoryName,
  setDescription,
  setDifficulty,
  setLessonDate,
  setLessonStepList,
  setLessonTitle,
  setRemaining,
  setMaterials,
  setMaximum,
  setPrice,
  setThumbnailUrl,
  setTimeTaken,
  setVideoUrl,
  setIntroduce,
  setCookyerName,
  setFood,
  setCookyerId,
  setBadge,
  setProfileImg,
} from "../store/lesson/lessonInfo";
import "../style/lesson/lessonDetailCss.css";
import defaultThumbnail from '../assets/non-image.png'

function LessonDetail() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const lessonId = id;
  const accessToken = localStorage.getItem("access_token");
  const categoryName = useSelector((state) => state.lessonInfo.categoryName);
  const difficulty = useSelector((state) => state.lessonInfo.difficulty);
  const lessonTitle = useSelector((state) => state.lessonInfo.lessonTitle);
  const thumbnailUrl = useSelector((state) => state.lessonInfo.thumbnailUrl);
  const lessonDate = useSelector((state) => state.lessonInfo.lessonDate);
  const userType = localStorage.getItem('role')

  const categoryId = useSelector((state) => state.lessonInfo.categoryId)

  const [ showModal, setShowModal ] = useState(false)

  const categories = ["-", "한식", "양식", "중식", "일식", "아시안", "건강식", "디저트"]
  useEffect(() => {
    const DateTransformType = new Date(lessonDate);
    const currentTime = new Date();
    const futureTime = new Date(currentTime.getTime() + 12 * 60 * 60 * 1000); // 현재 시간 + 12시간 

    if (lessonId && !showModal) {
      axios
        .get(`/api/v1/lesson/${lessonId}`, {
          headers: {
            Access_Token: accessToken,
          },
        })
        .then((res) => {
          console.log(res.data)
          dispatch(setCookyerId(res.data.cookyerId));
          dispatch(setCookyerName(res.data.cookyerName));
          dispatch(setFood(res.data.food));
          dispatch(setCategoryName(res.data.categoryName));
          dispatch(setCategoryId(res.data.categoryId));
          dispatch(setDescription(res.data.description));
          dispatch(setDifficulty(res.data.difficulty));
          dispatch(setLessonTitle(res.data.lessonTitle));
          dispatch(setLessonStepList(res.data.lessonStepList));
          dispatch(setMaterials(res.data.materials));
          dispatch(setMaximum(res.data.maximum));
          dispatch(setPrice(res.data.price));
          dispatch(setThumbnailUrl(res.data.thumbnailUrl));
          dispatch(setRemaining(res.data.remaining));
          dispatch(setVideoUrl(res.data.videoUrl));
          dispatch(setLessonDate(res.data.lessonDate));
          dispatch(setTimeTaken(res.data.timeTaken));
          dispatch(setVideoUrl(res.data.videoUrl));
          dispatch(setIntroduce(res.data.introduce));
          dispatch(setProfileImg(res.data.profileImg));

          axios
            .get(`/api/v1/lesson/badge/${res.data.cookyerId}`, {
              headers: {
                Access_Token: accessToken,
              },
            })
            .then((res) => {
              dispatch(setBadge(res.data.message));
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
          console.log(lessonId)
        });
    }
  }, [lessonId, showModal])

  return (
    <div className="lessonDetailContainer">
      <div className="detailLeftSection">
        <br />
        <div className="detailCategoryContainer">
          <span className="detailCategory">{categories[categoryId]}</span>{" "}
          <span className="detailCategory">{difficulty}</span>
        </div>
        <h2 className="detailLessonTitle"> {lessonTitle} </h2>
        {thumbnailUrl ? (
          <img className="detailThumbnail" src={thumbnailUrl} alt="" />
        ) : (
          <img className="detailThumbnail" src={defaultThumbnail} alt="image" />

        )}
        <IntroduceLesson />
        <hr />
        <IntroduceCookyer />
        <LessonReview />
      </div>

      <div className="detailRightSection">
        <CookieeNumber />
        <ApplyLesson showModal={showModal} setShowModal={setShowModal} />
        <LessonSchedule />
        {userType !== 'COOKIEE' && <EditLesson lessonId={lessonId} />}
      </div>
    </div>
  );
}

export default LessonDetail;

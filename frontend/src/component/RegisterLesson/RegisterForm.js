import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import "../../style/lesson/registerFormCss.css";
import { setVideoUrl } from "../../store/lesson/lesson";
function RegisterForm({ setContent, setShowAlert, setPath }) {
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");

  const [lessonThumbnailUrl, setLessonThumbnailUrl] = useState("");
  const [ThumbnailFile, setThumbnailFile] = useState(null);
  const accessToken = localStorage.getItem("access_token");
  const lessonTitle = useSelector((state) => state.lesson.lessonTitle);
  const categoryId = useSelector((state) => parseInt(state.lesson.categoryId));
  const maximum = useSelector((state) => parseInt(state.lesson.maximum));
  const price = useSelector((state) => parseInt(state.lesson.price));
  const lessonDate = useSelector((state) => state.lesson.lessonDate).slice(
    0,
    -5
  );
  const difficulty = useSelector((state) => state.lesson.difficulty);
  const timeTaken = useSelector((state) => parseInt(state.lesson.timeTaken));
  const description = useSelector((state) => state.lesson.description);
  const materials = useSelector((state) => state.lesson.materials);
  const videoUrl = useSelector((state) => state.lesson.videoUrl);
  const lessonStepList = useSelector((state) => state.lesson.lessonStepList);

  const categoryValid = useSelector((state) => state.lesson.categoryValid);
  const titleValid = useSelector((state) => state.lesson.titleValid);
  const maxValid = useSelector((state) => state.lesson.maxValid);
  const priceValid = useSelector((state) => state.lesson.priceValid);
  const dateValid = useSelector((state) => state.lesson.dateValid);
  const difficultyValid = useSelector((state) => state.lesson.difficultyValid);
  const timeTakenValid = useSelector((state) => state.lesson.timeTakenValid);
  const materialsValid = useSelector((state) => state.lesson.materialsValid);
  const stepValid = useSelector((state) => state.lesson.stepValid);
  const descriptionValid = useSelector(
    (state) => state.lesson.descriptionValid
  );
  const [thumbnailValid, setThumbnailValid] = useState(false);
  const isAllValid = [
    categoryValid,
    titleValid,
    maxValid,
    priceValid,
    dateValid,
    difficultyValid,
    timeTakenValid,
    materialsValid,
    stepValid,
    descriptionValid,
    thumbnailValid,
  ].every((isValid) => isValid);

  //불러오기
  const reduxVideoUrl = useSelector((state) => state.lesson.videoUrl);

  const dispatch = useDispatch();

  useEffect(() => {
    setLessonVideoUrl(reduxVideoUrl);
  }, [reduxVideoUrl, lessonVideoUrl]);

  const handleThumbnailUrl = (e) => {
    setLessonThumbnailUrl(e.target.value); // 파일명 유저들에게 보여주기
    const file = e.target.files[0];
    setThumbnailFile(file);
    setThumbnailValid(!!file);
    setThumbnailUrl(URL.createObjectURL(file));
  };
  const handleVideoUrl = (e) => {
    const url = e.target.value;
    dispatch(setVideoUrl(url));
    setLessonVideoUrl(url);
  };
  const register = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("thumbnailUrl", ThumbnailFile);
    formData.append("lessonTitle", lessonTitle);
    formData.append("categoryId", categoryId);
    formData.append("maximum", maximum);
    formData.append("price", price);
    formData.append("lessonDate", lessonDate);
    formData.append("difficulty", difficulty);
    formData.append("timeTaken", timeTaken);
    formData.append("description", description);
    formData.append("videoUrl", videoUrl);
    materials.forEach((material) => {
      formData.append("materials", material);
    });

    lessonStepList.forEach((step, index) => {
      formData.append(`lessonStepList[${index}].stepOrder`, step.stepOrder);
      formData.append(`lessonStepList[${index}].stepContent`, step.stepContent);
    });

    axios
      .post(`api/v1/lesson`, formData, {
        headers: {
          Access_Token: accessToken,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        setContent("과외가 등록되었습니다.");
        setShowAlert(true);
        setPath("/lesson");
        // alert('과외 생성에 성공했습니다!')
        // navigate('/lesson')
      })
      .catch((err) => {
        setContent("과외를 등록할 수 없습니다. 다시 한 번 확인해주세요.");
        setShowAlert(true);
        setPath(null);
        console.log(err);
      });
  };

  return (
    <div>
      <div>
        <div className="lessonInfoDescContainer">
          <div className="lessonInfoText">
            과외 썸네일 <span className="required">*</span>
          </div>
          {thumbnailUrl && thumbnailValid && (
            <img
              src={thumbnailUrl}
              alt="Selected Thumbnail"
              style={{
                maxWidth: "200px",
                marginTop: "10px",
                marginRight: "10px",
              }}
            />
          )}
          <input
            className="fileInputThumbnail"
            type="file"
            name="filename"
            value={lessonThumbnailUrl}
            onChange={handleThumbnailUrl}
            accept="image/*"
          />
        </div>
        <div className="lessonInfoTopContainer">
          <div className="lessonInfoText">맛보기 영상 링크</div>
          <input
            type="text"
            className="lessonInfoInput"
            value={lessonVideoUrl}
            onChange={handleVideoUrl}
            placeholder="맛보기 영상의 주소를 올려주세요!"
          />
        </div>
      </div>
      <button
        className={`lessonRegisterButton ${!isAllValid ? "disabled" : ""}`}
        disabled={!isAllValid}
        onClick={register}
      >
        과외 등록하기
      </button>
    </div>
  );
}

export default RegisterForm;

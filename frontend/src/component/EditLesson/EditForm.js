import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../style/lesson/editForm.css";
import AlertModal from "../Modal/AlertModal";
function EditForm() {
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);

  const lessonId = useSelector((state) => state.lessonInfo.lessonId);
  const [filename, setFileName] = useState("");
  const initVideoUrl = useSelector((state) => state.lessonEdit.videoUrl);
  const [videoUrl, setVideoUrl] = useState(initVideoUrl);

  const initThumbnail = useSelector((state) => state.lessonEdit.thumbnailUrl);
  const [thumbnailUrl, setThumbnailUrl] = useState(initThumbnail);
  const [ThumbnailFile, setThumbnailFile] = useState(""); // 파일 이름 넣을 것

  const accessToken = localStorage.getItem("access_token");
  const lessonTitle = useSelector((state) => state.lessonEdit.lessonTitle);
  const categoryId = useSelector((state) =>
    parseInt(state.lessonEdit.categoryId)
  );
  const price = useSelector((state) => parseInt(state.lessonEdit.price));
  const difficulty = useSelector((state) => state.lessonEdit.difficulty);
  const timeTaken = useSelector((state) =>
    parseInt(state.lessonEdit.timeTaken)
  );
  const description = useSelector((state) => state.lessonEdit.description);
  const materials = useSelector((state) => state.lessonEdit.materials);
  const lessonStepList = useSelector(
    (state) => state.lessonEdit.lessonStepList
  );

  const categoryValid = useSelector((state) => state.lessonEdit.categoryValid);
  const titleValid = useSelector((state) => state.lessonEdit.titleValid);
  const priceValid = useSelector((state) => state.lessonEdit.priceValid);
  const dateValid = useSelector((state) => state.lessonEdit.dateValid);
  const difficultyValid = useSelector(
    (state) => state.lessonEdit.difficultyValid
  );
  const timeTakenValid = useSelector(
    (state) => state.lessonEdit.timeTakenValid
  );
  const materialsValid = useSelector(
    (state) => state.lessonEdit.materialsValid
  );
  const stepValid = useSelector((state) => state.lessonEdit.stepValid);
  const descriptionValid = useSelector(
    (state) => state.lessonEdit.descriptionValid
  );
  const [thumbnailValid, setThumbnailValid] = useState(true);

  useEffect(() => {
    setThumbnailUrl(initThumbnail);
    setVideoUrl(initVideoUrl);
  }, [initVideoUrl, initThumbnail]);

  const isAllValid = [
    categoryValid,
    titleValid,
    priceValid,
    dateValid,
    difficultyValid,
    timeTakenValid,
    materialsValid,
    stepValid,
    descriptionValid,
  ].every((isValid) => isValid);

  const handleThumbnailUrl = (e) => {
    setFileName(e.target.value); // 파일명 유저들에게 보여주기
    const file = e.target.files[0];
    setThumbnailFile(file); //파일명 넣어주기
    setThumbnailUrl(URL.createObjectURL(file));
    setThumbnailValid(!!file);
    console.log(file, ThumbnailFile, thumbnailUrl);
  };

  const handleVideoUrl = (e) => {
    setVideoUrl(e.target.value);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const register = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (ThumbnailFile !== "") {
      formData.append("thumbnailUrl", ThumbnailFile);
    }

    // formData.append("thumbnailUrl", ThumbnailFile);
    formData.append("lessonId", lessonId);
    formData.append("lessonTitle", lessonTitle);
    formData.append("categoryId", categoryId);
    formData.append("price", price);
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
      .put(`/api/v1/lesson`, formData, {
        headers: {
          Access_Token: accessToken,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        window.scrollTo({ top: 0 });
        setModalOpen(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div>
        <div className="lesson-info-desc-container">
          <div className="lesson-info-text">
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
            className="file-input-thumbnail"
            type="file"
            name="filename"
            value={filename}
            onChange={handleThumbnailUrl}
            accept="image/*"
          />
        </div>
        <div className="edit-info-top-container">
          <div className="edit-info-text">맛보기 영상 링크</div>
          <input
            className="edit-info-input"
            type="text"
            value={videoUrl}
            onChange={handleVideoUrl}
            placeholder="맛보기 영상의 주소를 올려주세요!"
          />
        </div>
      </div>
      <button
        className={`lesson-edit-button ${!isAllValid ? "disabled" : ""}`}
        disabled={!isAllValid}
        onClick={register}
      >
        과외 수정하기
      </button>
      {modalOpen && (
        <AlertModal
          content="과외 수정이 성공적으로 이루어졌습니다."
          path="/lesson"
          data={false}
          // actions={null}
          actions={handleCloseModal}
        />
      )}
    </div>
  );
}

export default EditForm;

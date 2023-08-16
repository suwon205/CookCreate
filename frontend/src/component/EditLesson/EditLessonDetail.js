import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setMaximum,
  setMaximumValid,
  setDifficulty,
  setDescription,
  setMaterials,
  setDifficultyValid,
  setDescriptionValid,
  setMaterialsValid,
} from "../../store/lesson/lessonEdit";
import "../../style/lesson/editLessonDetail.css";
function EditLessonDetail() {
  const dispatch = useDispatch();
  const initPrice = useSelector((state) => state.lessonEdit.price);
  const initMaximum = useSelector((state) => state.lessonEdit.maximum);
  const initDifficulty = useSelector((state) => state.lessonEdit.difficulty);
  const initDescription = useSelector((state) => state.lessonEdit.description);
  const initMaterial = useSelector((state) => state.lessonEdit.materials);

  const [maximum, setLessonMaximum] = useState(initMaximum);
  const [lessonDifficulty, setLessonDifficulty] = useState(initDifficulty);
  const [selectedDifficulty, setSelectedDifficulty] = useState(initDifficulty);
  const [lessonDescription, setLessonDescription] = useState(initDescription);
  const [lessonMaterialList, setLessonMaterialList] = useState(initMaterial);
  const [lessonMaterial, setLessonMaterial] = useState("");
  //유효성
  const priceValid = useSelector((state) => state.lessonEdit.priceValid);
  const maxValid = useSelector((state) => state.lessonEdit.maxValid);
  const difficultyValid = useSelector(
    (state) => state.lessonEdit.difficultyValid
  );
  const descriptionValid = useSelector(
    (state) => state.lessonEdit.descriptionValid
  );
  const materialValid = useSelector((state) => state.lessonEdit.materialsValid);

  useEffect(() => {
    setLessonMaximum(initMaximum);
    setLessonDifficulty(initDifficulty);
    setDifficulty(initDifficulty);
    setSelectedDifficulty(initDifficulty);
    setLessonDescription(initDescription);
    setLessonMaterialList(initMaterial);
  }, [initMaximum, initDifficulty, initDescription, initMaterial]);

  const changeMaximum = (e) => {
    const input = e.target.value;
    setLessonMaximum(input);
    dispatch(setMaximum(input));
    dispatch(setMaximumValid(input.trim() !== ""));
  };

  const handleDifficultyClick = (difficulty) => {
    setLessonDifficulty(difficulty);
    setSelectedDifficulty(difficulty);
    dispatch(setDifficultyValid(true));
  };
  const handleLessonDescription = (e) => {
    const input = e.target.value;
    setLessonDescription(input);
    dispatch(setDescription(input));
    dispatch(setDescriptionValid(input.trim() !== ""));
  };

  const handleChange = (e) => {
    setLessonMaterial(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const newList = lessonMaterial
      .split("\n")
      .map((str) => str.trim())
      .filter((str) => str !== "");
    setLessonMaterialList(newList);
    dispatch(
      setMaterialsValid(lessonDescription.trim() !== "" || newList.length > 0)
    );
  };

  useEffect(() => {
    if (maximum) {
      dispatch(setMaximum(maximum));
    }
    if (lessonDifficulty) {
      dispatch(setDifficulty(lessonDifficulty));
    }
    if (lessonDescription) {
      dispatch(setDescription(lessonDescription));
    }
    if (lessonMaterialList) {
      dispatch(setMaterials(lessonMaterialList));
    }
  }, [
    dispatch,
    maximum,
    lessonDifficulty,
    lessonDescription,
    lessonMaterialList,
  ]);

  return (
    <div>
      <div>
        <div className="edit-info-top-container">
          <div className="edit-info-top-title-container">
            <div className="edit-info-text">
              수강료 <span className="required">*</span>
              <div className="edit-info-mate-desc">
                수강료는 수정할 수
                <br />
                없습니다.
              </div>
            </div>
            <div className="price">{initPrice.toLocaleString()} 원</div>
          </div>
          {/* 최대 수강 인원 */}
          <div className="edit-info-top-title-container">
            <div className="edit-info-text">
              최대 수강 인원<span className="required">*</span>
            </div>
            <select
              className="edit-info-select"
              value={maximum}
              onChange={changeMaximum}
            >
              <option value="">-</option>
              <option value="1">1명</option>
              <option value="2">2명</option>
              <option value="3">3명</option>
              <option value="4">4명</option>
              <option value="5">5명</option>
              <option value="6">6명</option>
            </select>
          </div>
        </div>
        {/* 난이도 */}
        <div className="edit-info-top-container">
          <div className="edit-info-text">
            과외 난이도 <span className="required">*</span>
          </div>
          <div className="edit-info-difficulty-container">
            <div
              className="edit-info-difficulty"
              onClick={() => handleDifficultyClick("EASY")}
              style={{
                border:
                  selectedDifficulty === "EASY"
                    ? "0.7px solid #FF7A42"
                    : "0.7px solid #CBCBCB",
                borderRadius: "50px",
                color: selectedDifficulty === "EASY" ? "#FF7A42" : "#333",
                backgroundColor:
                  selectedDifficulty === "EASY" ? "#FFF4F0" : "#FFF",
                padding: "8px",
                marginRight: "5px",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              EASY
            </div>
            <div
              onClick={() => handleDifficultyClick("NORMAL")}
              style={{
                border:
                  selectedDifficulty === "NORMAL"
                    ? "0.7px solid #FF7A42"
                    : "0.7px solid #CBCBCB",
                borderRadius: "50px",
                color: selectedDifficulty === "NORMAL" ? "#FF7A42" : "#333",
                backgroundColor:
                  selectedDifficulty === "NORMAL" ? "#FFF4F0" : "#FFF",
                padding: "8px",
                marginRight: "5px",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              NORMAL
            </div>
            <div
              onClick={() => handleDifficultyClick("HARD")}
              style={{
                border:
                  selectedDifficulty === "HARD"
                    ? "0.7px solid #FF7A42"
                    : "0.7px solid #CBCBCB",
                borderRadius: "50px",
                color: selectedDifficulty === "HARD" ? "#FF7A42" : "#333",
                backgroundColor:
                  selectedDifficulty === "HARD" ? "#FFF4F0" : "#FFF",
                padding: "8px",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              HARD
            </div>
          </div>
        </div>
        {/* 과외 설명 */}
        <div className="edit-info-desc-container">
          <div className="edit-info-desc">
            과외 설명 <span className="required">*</span>
          </div>
          <textarea
            className="edit-info-input-desc"
            value={lessonDescription}
            onChange={handleLessonDescription}
            placeholder="과외 설명"
          />
        </div>
      </div>
      <div className="edit-info-desc-container">
        <div className="edit-info-mate">
          준비물 입력 <span className="required">*</span>{" "}
          <div className="edit-info-mate-desc">
            준비물을 입력하고
            <br />
            화살표 버튼을 눌러서
            <br />
            추가해주세요.
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mate-input-container">
            <textarea
              className="edit-info-input-mate"
              value={lessonMaterial}
              onChange={handleChange}
              placeholder="재료를 입력하세요. 각 재료들을 새 줄로 입력해주시면 됩니다."
              rows={5}
              cols={40}
            />
            <button className="mateSubmitButton" type="submit">
              &gt;
            </button>
          </div>
        </form>
        <div className="edit-info-input-mate">
          {lessonMaterialList !== undefined &&
          lessonMaterialList !== null &&
          lessonMaterialList
            ? lessonMaterialList.map((str, index) => (
                <div key={index}>{str}</div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

export default EditLessonDetail;

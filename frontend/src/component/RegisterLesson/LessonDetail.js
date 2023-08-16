import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPrice,
  setPriceValid,
  setMaximum,
  setMaximumValid,
  setDifficulty,
  setDescription,
  setMaterials,
  setDifficultyValid,
  setDescriptionValid,
  setMaterialsValid,
} from "../../store/lesson/lesson";
import "../../style/lesson/registerLessonDetailCss.css";

function LessonDetail() {
  const dispatch = useDispatch();
  const [maximum, setLessonMaximum] = useState("");
  const [lessonDifficulty, setLessonDifficulty] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [lessonPrice, setLessonPrice] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [lessonMaterialList, setLessonMaterialList] = useState([]);
  const [lessonMaterial, setLessonMaterial] = useState("");
  //불러오기
  const reduxPrice = useSelector((state) => state.lesson.price);
  const reduxMaximum = useSelector((state) => state.lesson.maximum);
  const reduxDescribe = useSelector((state) => state.lesson.description);
  const reduxDifficulty = useSelector((state) => state.lesson.difficulty);
  const reduxMaterialList = useSelector((state) => state.lesson.materials);
  //유효성
  // const priceValid = useSelector((state) => state.lesson.priceValid)
  // const maxValid = useSelector((state) => state.lesson.maxValid)
  // const difficultyValid = useSelector((state) => state.lesson.difficultyValid)
  // const descriptionValid = useSelector((state) => state.lesson.descriptionValid)
  // const materialValid = useSelector((state) => state.lesson.materialsValid)
  const [errorMsg, setErrorMsg] = useState("");

  const handleChangePrice = (e) => {
    const input = e.target.value;
    if (isNaN(input)) {
      setErrorMsg("숫자만 입력해주세요!");
    } else {
      setErrorMsg("");
      setLessonPrice(input);
      dispatch(setPrice(input));
    }
  };
  const changeMaximum = (e) => {
    const input = e.target.value;
    setLessonMaximum(input);
    dispatch(setMaximum(input));
  };
  const handleDifficultyClick = (difficulty) => {
    setLessonDifficulty(difficulty);
    dispatch(setDifficulty(difficulty));
  };
  const handleLessonDescription = (e) => {
    const input = e.target.value;
    setLessonDescription(input);
    dispatch(setDescription(input));
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
    dispatch(setMaterials(newList));
  };
  useEffect(() => {
    setLessonPrice(reduxPrice);
    dispatch(setPriceValid(!!lessonPrice.toString().length));
  }, [reduxPrice, lessonPrice]);

  useEffect(() => {
    setLessonDescription(reduxDescribe);
    dispatch(setDescriptionValid(lessonDescription.trim() !== ""));
  }, [lessonDescription, reduxDescribe]);

  useEffect(() => {
    setLessonMaximum(reduxMaximum);
    dispatch(setMaximumValid(maximum !== 0));
  }, [reduxMaximum, maximum]);

  useEffect(() => {
    setSelectedDifficulty(reduxDifficulty);
    dispatch(setDifficultyValid(!!reduxDifficulty));
  }, [reduxDifficulty]);

  useEffect(() => {
    setLessonMaterialList(reduxMaterialList);
    dispatch(
      setMaterialsValid(
        lessonMaterial.trim() !== "" || lessonMaterialList.length > 0
      )
    );
  }, [reduxMaterialList, lessonMaterialList]);

  return (
    <div>
      <div>
        <div className="lessonInfoTopContainer">
          <div className="lessonInfoTopTitleContainer">
            <div className="lessonInfoText">
              수강료 <span className="required">*</span>
            </div>
            <input
              className="lessonInfoInputPrice"
              type="text"
              min="0"
              placeholder="수강료"
              value={lessonPrice}
              onChange={handleChangePrice}
            />
            <div className="price-unit">원</div>
          </div>
          <div className="lessonInfoTopTitleContainer">
            <div className="lessonInfoText">
              최대 수강 인원 <span className="required">*</span>
            </div>
            <select
              className="lessonInfoSelect"
              value={maximum}
              onChange={changeMaximum}
            >
              <option value="">-</option>
              {Array.from({ length: 6 }, (_, index) => index + 1).map(
                (value) => (
                  <option key={value} value={value}>
                    {value}명
                  </option>
                )
              )}
            </select>
          </div>
        </div>
        {errorMsg && <div className="lessonDetailError">{errorMsg}</div>}

        <div className="lessonInfoTopContainer">
          <div className="lessonInfoText">
            과외 난이도 <span className="required">*</span>
          </div>
          <div className="lessonInfoDifficultyContainer">
            <div
              className="lessonInfoDifficulty"
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
        <div className="lessonInfoDescContainer">
          <div className="lessonInfoDesc">
            과외 설명 <span className="required">*</span>
          </div>
          <textarea
            className="lessonInfoInputDesc"
            value={lessonDescription}
            onChange={handleLessonDescription}
            placeholder="과외 설명"
          />
        </div>
      </div>

      <div className="lessonInfoDescContainer">
        <div className="lessonInfoMate">
          준비물 입력 <span className="required">*</span>{" "}
          <div className="lessonInfoMateDesc">
            준비물을 입력하고
            <br />
            화살표 버튼을 눌러서
            <br />
            추가해주세요.
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mateInputContainer">
            <textarea
              className="lessonInfoInputMate"
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
        <div className="lessonInfoInputMate">
          {lessonMaterialList &&
            lessonMaterialList.map((str, index) => (
              <div key={index}>{str}</div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default LessonDetail;

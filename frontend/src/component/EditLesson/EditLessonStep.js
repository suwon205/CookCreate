import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLessonStepList, setStepValid } from "../../store/lesson/lessonEdit";
import '../../style/lesson/editLesson.css'
function EditLessonStep() {
  const dispatch = useDispatch();
  const initStepList = useSelector((state) => state.lessonEdit.lessonStepList);
  const [stepList, setStepList] = useState(initStepList);
  const [errMsg, setErrMsg] = useState("");

  const handleChange = (index, value) => {
    const updatedList = [...stepList];
    updatedList[index] = { ...updatedList[index], stepContent: value };
    setStepList(updatedList);
  };

  const handleAddInput = () => {
    if (stepList[stepList.length - 1].stepContent.trim() === "") {
      setErrMsg("마지막 단계를 채워주세요.");
      return;
    }
    setStepList((prevList) => [
      ...prevList,  
      {
        stepOrder: prevList.length + 1,
        stepContent: "",
      },
    ]);
    setErrMsg("");
  };

  const handleRemoveInput = (index) => {
    if (stepList.length > 1) {
      setStepList((prevList) => {
        const updatedList = prevList
          .filter((_, i) => i !== index)
          .map((step, i) => ({
            ...step,
            stepOrder: i + 1,
          }));
        return updatedList;
      });
    }
  };

  const checkStepContentFilled = useCallback(() => {
    if (stepList) {
      return stepList.every((step) => step.stepContent.trim() !== "");
    }
  }, [stepList]);

  useEffect(() => {
    setStepList(initStepList);
  }, [initStepList]);

  useEffect(() => {
    dispatch(setLessonStepList(stepList));
    dispatch(setStepValid(checkStepContentFilled()));
  }, [dispatch, stepList, checkStepContentFilled]);

  return (
    <div>
      <div className="edit-info-desc-container">
        <div className="edit-info-mate">
          진행 단계 <span className="required">*</span>
        </div>
        <div className="edit-step-input-container">
          {stepList !== undefined && stepList !== null && stepList
            ? stepList.map((step, index) => (
                <div key={index} className="edit-step-input-wrapper">
                  <input
                    type="text"
                    value={step.stepContent}
                    onChange={(e) => handleChange(index, e.target.value)}
                    placeholder={`요리 진행 단계를 입력하세요`}
                    className="edit-info-input"
                  />
                  {stepList.length > 1 && (
                    <button
                      className="edit-step-cancel-button"
                      onClick={() => handleRemoveInput(index)}
                    >
                      삭제
                    </button>
                  )}
                </div>
              ))
            : null}
          <button className="edit-step-plus-button" onClick={handleAddInput}>
            +
          </button>
          {errMsg && <p className="edit-step-msg">{errMsg}</p>}
          <p className="edit-step-msg">
            {checkStepContentFilled()
              ? "모든 단계가 찼습니다."
              : "단계를 모두 입력해주세요."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default EditLessonStep;

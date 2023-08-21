import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../style/lesson/apply-lesson-css.css";
import { useNavigate } from "react-router";
import ApplyCompleteModal from "./ApplyCompleteModal";
import AlertModal from "../Modal/AlertModal";
import { setClassData } from "../../store/mypageS/accountS";

function ApplyLesson({ showModal, setShowModal }) {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [disable, setDisable] = useState(false);
  const [disableMsg, setDisableMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [payUrl, setPayUrl] = useState("");
  const [popupWindow, setPopupWindow] = useState("");

  const price = useSelector((state) => state.lessonInfo.price);
  const lessonId = useSelector((state) => state.lessonInfo.lessonId);
  const videoUrl = useSelector((state) => state.lessonInfo.videoUrl);
  const access_token = useSelector((state) => state.auth.access_token);
  const role = localStorage.getItem("role");

  const remaining = useSelector((state) => state.lessonInfo.remaining);
  const lessonDate = useSelector((state) => state.lessonInfo.lessonDate);
  const DateTransformType = new Date(lessonDate);
  const currentTime = new Date();
  const futureTime = new Date(currentTime.getTime() + 12 * 60 * 60 * 1000);

  /** 과외 신청 완료 및 실패 모달 */
  const [modalInfo, setModalInfo] = useState(null);
  const [showFailModal, setShowFailModal] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false)

  useEffect(() => {
    if (remaining === 0) {
      setDisable(true);
      setDisableMsg("최대 인원을 채운 과외입니다.");
    } else if (futureTime > DateTransformType) {
      setDisable(true);
      setDisableMsg(
        "현재 시간 기준 12시간 이전에 예정된 과외는 수강 신청할 수 없습니다."
      );
    } else {
      setDisable(false);
      setDisableMsg("");
    }
  }, [remaining, DateTransformType, futureTime]);

  const handleApply = () => {
    axios
      .post(
        `/api/v1/pay/ready/${lessonId}`,
        {},
        {
          headers: {
            Access_Token: access_token,
          },
        }
      )
      .then((res) => {
        setPayUrl(res.data.next_redirect_pc_url);
        const popupWindow = window.open(
          res.data.next_redirect_pc_url,
          "_blank",
          "width=500, height=600"
        );
        setPopupWindow(popupWindow);
      })
      .catch((err) => {
        setErrMsg(err.response.data.message);
      });
  };

  useEffect(() => {
    if (popupWindow) {
      const timer = setInterval(() => {
        const searchParams = new URL(popupWindow.location.href).searchParams;
        const payStatus = searchParams.get("payStatus");
        console.log(payStatus);
        if (payStatus === "COMPLETED") {
          popupWindow.close();
          console.log("결제 성공");
          setApplySuccess(true)
          axios
            .post(
              `/api/v1/lesson/${lessonId}`,
              {},
              {
                headers: {
                  Access_Token: access_token,
                },
              }
            )
            .then((res) => {
              setShowModal(true);
              setModalInfo(res.data);
              console.log(res.data);
            })
            .catch((err) => {
              console.log(err);
            });
          clearInterval(timer);
        } else if (payStatus === "CANCELLED" || payStatus === "FAILED") {
          setShowFailModal(true);
          clearInterval(timer);
        }
      }, 100);
      return () => {
        clearInterval(timer);
      };
    }
  }, [popupWindow]);

  /** 결제 성공시 신청수업 모달 정보 업데이트 */
  useEffect(() => {
    if (applySuccess && access_token && role === "COOKIEE") {
      axios
        .get(`/api/v1/my/applied`, {
          headers: {
            Access_Token: access_token,
          },
        })
        .then((res) => {
          console.log(res.data)
          console.log('신청한 수업 목록 받아와짐')
        if (typeof(res.data) === 'object' && res.data[0].message !== "신청한 과외가 없습니다.") {
          dispatch(setClassData(res.data))
        } else {
          dispatch(setClassData(null))
        }

        })
        .catch((err) => {
          console.log(err);
          console.log("신청한 수업 목록 안받아와짐");
        });
    }
  } , [applySuccess, access_token, role])

  return (
    <div className="applyLessonContainer">
      {showFailModal && (
        <AlertModal
          content="다시 결제를 시도해주세요."
          path={null}
          actions={setShowFailModal}
          data={false}
        />
      )}
      {showModal && (
        <ApplyCompleteModal setShowModal={setShowModal} lesson={modalInfo} />
      )}
      <div className="applyLessonPrice">
        {price && price.toLocaleString()}원
      </div>
      <div className="applyLessonApplyButtonContainer">
        {role === "COOKIEE" && (
          <button
            onClick={handleApply}
            className={`applyLessonApplyButton ${disable ? "disabled" : ""}`}
            disabled={disable}
          >
            신청하기
          </button>
        )}
      </div>
      {errMsg && <div className="errMsg">{errMsg}</div>}
      {disableMsg && <div className="disableMsg">{disableMsg}</div>}
      {videoUrl && (
        <div className="applyLessonVideoUrl">
          <a href={videoUrl}> 과외 맛보기 </a>
        </div>
      )}
    </div>
  );
}

export default ApplyLesson;

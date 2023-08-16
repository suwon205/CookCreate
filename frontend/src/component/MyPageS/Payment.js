import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "./SideBar";
import axios from "axios";
import { useNavigate } from "react-router";
import { setLessonId } from "../../store/lesson/lessonInfo";
import "./../../style/mypage/mypage.css";
import "./../../style/mypage/payment.css";

function formatDateTime(dateTimeString) {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
  };
  return new Date(dateTimeString).toLocaleString("ko-KR", options);
}

function Payment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const accessToken = useSelector((state) => state.auth.access_token);
  const [userPayment, setUserPayments] = useState([]);
  const [state, setState] = useState(""); // 결제 상태
  const paymentMessage =
    userPayment[0]?.lessonId === 0 ? "결제 내역이 없습니다." : "";

  /** 이동할 과외 아이디 */
  const [goLessonDetail, setGoLessonDetail] = useState(false);
  const lessonId = useSelector((state) => state.lessonInfo.lessonId);

  const handleRefund = async (lessonId) => {
    try {
      // 결제 환불 먼저 진행
      const refundResponse = await axios.put(
        `api/v1/pay/refund/${lessonId}`,
        {},
        {
          headers: {
            Access_Token: accessToken,
          },
        }
      );

      console.log(refundResponse);
      console.log("환불 성공!");

      // 과외 취소
      const cancelResponse = await axios.delete(`api/v1/lesson/cancel/${lessonId}`, {
        headers: {
          Access_Token: accessToken,
        },
      });

      console.log(cancelResponse);
      console.log("과외 취소!");

      // 환불 성공 후에 환불 시간을 업데이트하고 결제 정보를 다시 가져와서 화면에 표시
      const paymentResponse = await axios.get(`api/v1/my/cookiee`, {
        headers: {
          Access_Token: accessToken,
        },
      });

      setUserPayments(paymentResponse.data);
      console.log(paymentResponse.data);
    } catch (error) {
      console.log(error);
      console.log("환불 실패");
    }
  };

  useEffect(() => {
    if (accessToken) {
      axios
        .get(`api/v1/my/cookiee`, {
          headers: {
            Access_Token: accessToken,
          },
        })
        .then((res) => {
          setUserPayments(res.data);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [accessToken]);

  const goLesson = (lessonId) => {
    setGoLessonDetail(true);
    dispatch(setLessonId(lessonId));
    navigate(`/lesson/${lessonId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (goLessonDetail && lessonId !== null) {
      navigate(`/lesson/${lessonId}`);
    }
  }, [lessonId]);

  return (
    <div className="mypage">
      <SideBar />
      <section className="pay-box">
        <div className="pay-header">
          <div className="mypage-title">결제내역</div>
        </div>
        {paymentMessage ? (
          <div className="no-payment">{paymentMessage}</div>
        ) : (
          userPayment.map((payment) => (
            <div className="pay-item" key={payment.paymentId}>
              <div className="pay-list">
                
                {/* <div className="pay-info">
                  <div className="pay-label">결제정보</div>
                </div> */}
                <div className="info-details">
                  <div className="pay-row lesson-title">
                    <div className="pay-col1">과외명</div>
                    <div className="pay-col2" onClick={() => goLesson(payment.lessonId)}>{payment.lessonTitle}</div>
                  </div>
                  <div className="pay-row state">
                    <div className="pay-col1">결제상태</div>
                    <div className="pay-col2">
                    {(() => {
                      switch (payment.payStatus) {
                        case "READY":
                          return "결제 준비중";
                        case "FAIL":
                          return "결제 실패";
                        case "CANCEL":
                          return "결제 취소";
                        case "COMPLETED":
                          return "결제 완료";
                        case "REFUND":
                          return "환불 처리";
                        default:
                          return "알 수 없음";
                      }
                    })()}
                    </div>
                  </div>
                  <div className="pay-row payment-date">
                    <div className="pay-col1">결제일</div>
                    <div className="pay-col2">
                      {new Date(payment.approvedAt).toLocaleDateString(
                        "ko-KR",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                  </div>
                  <div className="pay-row refund-date">
                    <div className="pay-col1">환불 시간</div>
                    <div className="pay-col2">
                    {payment.canceledAt !== null ? (
                      <div>{formatDateTime(payment.canceledAt)}</div>
                    ) : (
                      <div>-</div>
                    )}
                    {payment.payStatus !== "REFUND" && (
                <div
                  className="refund-button"
                  onClick={() => handleRefund(payment.lessonId)}
                > 
                  강의 취소(환불하기)
                </div>
              )}
              {errMsg}
                    </div>
                  </div>
                  <div className="pay-row price">
                    <div className="pay-col1">결제 금액</div>
                    <div className="pay-col2">
                      {payment.totalAmount} 원
                    </div>
                  </div>
                </div>
              </div>
              {/* <hr /> */}
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default Payment;

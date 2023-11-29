// import React from 'react';
import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
// import { useSelector} from "react-redux";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { setLessonId } from "../../store/lesson/lessonInfo";
import "./../../style/mypage/payroll.css";
import "./../../style/mypage/mypage.css";




function Payroll() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const accessToken = localStorage.getItem('access_token')
  const [ pays, setPays ] = useState([]);
  const payrollMessage = pays[0]?.lessonId === 0 ? "정산 내역이 없습니다." : "";

  /** 이동할 과외 아이디 */
  const [ goLessonDetail, setGoLessonDetail ] = useState(false)
  const lessonId = useSelector((state) => state.lessonInfo.lessonId)

  useEffect(() => {
    if (accessToken) {
      axios
        .get(`api/v1/my/cookyer`, {
          headers: {
            Access_Token: accessToken,
          },
        })
        .then((res) => {
          setPays(res.data);
          console.log("정산목록", res.data);
        })
        .catch((err) => {
          console.log("정산에러", err);
        });
    }
  }, [accessToken]);

  const goLesson = (lessonId) => {
    setGoLessonDetail(true)
    dispatch(setLessonId(lessonId))
    navigate(`/lesson/${lessonId}`)
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }

  useEffect(() => {
    if (goLessonDetail && lessonId !== null) {
      navigate(`/lesson/${lessonId}`)
      window.scrollTo({ top: 0, behavior: 'smooth' });

    }
  }, [lessonId])

  return (
    <div className="mypage">
      <SideBar />
      <section className="pay-box">
        <div className="my-class-title-wrap">
          <h3 className="my-class-title">정산내역</h3>
        </div>
          {payrollMessage ? (
          <div className="no-payment">{payrollMessage}</div>
        ) : (
          // 결제내역이 있는 경우
          pays.map((pay) => (
            <div className="pay-item" key={pay.id}>
              <dl className="pay-list">
                <div className="pay-state">
                    <div>결제상태</div>
                    <div>
                      {(() => {
                        switch (pay.payStatus) {
                          case 'READY':
                            return '결제 준비중';
                          case 'FAIL':
                            return '결제 실패'
                          case 'CANCEL':
                            return '결제 취소'
                          case 'COMPLETED':
                            return '결제 완료'
                          case 'REFUND':
                            return '환불 처리'
                          default:
                            return '알 수 없음'
                        }
                      })()}
                    </div>
                  </div>
                <p className="pay_info">결제정보</p>
                <div className="class_info">
                  <dl className="info_details">
                    <div className="pay-row">
                      <dt>과외명</dt>
                      <dd onClick={() => goLesson(pay.lessonId)}>{pay.lessonTitle}</dd>
                    </div>
                    <div className="pay-row">
                      <dt>승인시간</dt>
                      <dd>{new Date(pay.approvedAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</dd>
                    </div>
                  </dl>
                  <dl className="info_price pay-row">
                    <dt>결제 금액</dt>
                    <dd>
                      {pay.totalAmount} 원
                    </dd>
                  </dl>
                </div>
              </dl>
            </div>
          ))
        )}
      </section>
    </div>
  );
}


export default Payroll;
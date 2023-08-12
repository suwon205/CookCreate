// import React from 'react';
import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
// import { useSelector} from "react-redux";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { setLessonId } from "../../store/lesson/lessonInfo";


function Payroll() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const accessToken = localStorage.getItem('access_token')
  const [pays, setPays] = useState([]);
  const payrollMessage = pays[0]?.lessonId === 0 ? "정산 내역이 없습니다." : "";

  /** 이동할 과외 아이디 */
  const [ goLessonDetail, setGoLessonDetail ] = useState(false)
  const lessonId = useSelector((state) => state.lessonInfo.lessonId)

  useEffect(() => {
    axios
      .get(`api/v1/my/cookyer`, {
        headers: {
          Access_Token: accessToken,
        },
      })
      .then((res) => {
        setPays(res.data);
        console.log("정산목록",pays);
      })
      .catch((err) => {
        console.log("정산에러",err);
      });
  }, [accessToken,pays]);

  const goLesson = (lessonId) => {
    setGoLessonDetail(true)
    dispatch(setLessonId(lessonId))
    navigate(`/lesson/${lessonId}`)
  }

  useEffect(() => {
    if (goLessonDetail && lessonId !== null) {
      navigate(`/lesson/${lessonId}`)
    }
  }, [lessonId])

  return (
    <div className="mypage">
      <SideBar />
      <section className="pay_box">
        <div className="pay_header">
          <div>
            <span>결제내역</span>
          </div>
        </div>
        {/* {userPayment.length === 0 ? ( // 결제내역이 없는 경우
          <div className="no_payment">결제내역이 없습니다.</div>
        ) : ( */}
          {payrollMessage ? (
          <div className="no_payment">{payrollMessage}</div>
        ) : (
          // 결제내역이 있는 경우
          pays.map((pay) => (
            <div className="pay_item" key={pay.id}>
              <dl className="pay_list">
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
                    {/* <dt>가격</dt>
                    <dd>{payment.totalAmount} 원</dd> */}
                    <dt>과외명</dt>
                    <dd onClick={() => goLesson(pay.lessonId)}>{pay.lessonTitle}</dd>
                    <dt>결제 수단</dt>
                    <dd>{pay.cardInfo}</dd>
                    <dt>결제 승인 완료 시간</dt>
                    <dd>{new Date(pay.approvedAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</dd>
                  </dl>
                  <dl className="info_price">
                    <dt>결제 금액</dt>
                    <dd>
                      {pay.totalAmount} 원
                      {/* <button type="button" className="payback">
                        환불 신청
                      </button> */}
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
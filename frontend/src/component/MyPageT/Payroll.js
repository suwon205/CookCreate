// import React from 'react';
import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
// import { useSelector} from "react-redux";
import axios from "axios";


function Payroll() {
  const accessToken = localStorage.getItem('access_token')
  const [pays, setPays] = useState([]);
  const payrollMessage = pays[0]?.lessonId === 0 ? "정산 내역이 없습니다." : "";



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
                <div className="pay_label">
                  <span className="pay_state">결제상태{pay.payStatus}</span>
                </div>
                <strong className="pay_info">결제정보</strong>
                <div className="class_info">
                  <dl className="info_details">
                    {/* <dt>가격</dt>
                    <dd>{payment.totalAmount} 원</dd> */}
                    <dt>과외명</dt>
                    <dd>{pay.lessonTitle} 원</dd>
                    <dt>결제 수단</dt>
                    <dd>{pay.cardInfo}</dd>
                    <dt>결제 승인 완료 시간</dt>
                    <dd>{pay.approvedAt}</dd>
                  </dl>
                  <dl className="info_price">
                    <dt>결제 금액</dt>
                    <dd>
                      {pay.totalAmount} 원
                      <button type="button" className="payback">
                        환불 신청
                      </button>
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
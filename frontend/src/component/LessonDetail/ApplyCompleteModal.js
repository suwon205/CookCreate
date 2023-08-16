import { useNavigate } from "react-router-dom";
import '../../style/modal/alertModal.css';

function ApplyCompleteModal({ setShowModal, lesson }) {

  return (
    <div className="apply-complete-modal">
      <div className='cookyer-lesson-step-modal-title-wrapper'>
        <p className="cookyer-lesson-step-modal-title">과외 신청이 완료되었습니다.</p>
        <p className='cookyer-lesson-step-modal-desc'>과외 일정에 맞추어 참여해주세요.</p>
      </div>
      <div className="apply-complete-contents">
        <div className="apply-complete-content">
          <p className="apply-complete-title">신청 수업</p>
          <p className="apply-complete-info">{lesson.lessonTitle}</p>
        </div>
        <div className="apply-complete-content">
          <p className="apply-complete-title">결제 금액</p>
          <p className="apply-complete-info">{lesson.price} 원</p>
        </div>
        <div className="apply-complete-content">
          <p className="apply-complete-title">과외 일정</p>
          <p className="apply-complete-info">{new Date(lesson.lessonDate).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit", weekday: "short", hour: "2-digit", minute: "2-digit"})}</p>
        </div>
        <div className="apply-complete-content">
          <p className="apply-complete-title">과외 시간</p>
          <p className="apply-complete-info">{lesson.timeTaken} 분</p>
        </div>
      </div>
      <div className='cookyer-lesson-step-modal-btn'>
        <button className="alert-button" onClick={() => setShowModal(false)}>확인</button>
      </div>
    </div>
  );
}

export default ApplyCompleteModal;
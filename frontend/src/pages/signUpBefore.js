import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/auth/signUpBefore.css";
import AlertModal from "../component/Modal/AlertModal";
function SignUpBefore() {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    localStorage.clear();
  }, []);
  const navigate = useNavigate();
  const [activeUserType, setActiveUserType] = useState(null);

  const handleUserType = (userType) => {
    localStorage.setItem("userType", userType);
    setActiveUserType(userType);
  };
  const handleSignUpBtn = () => {
    if (!activeUserType) {
      setModalOpen(true);
    } else {
      navigate("/signup");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false); // 모달 닫기
  };

  return (
    <div className="view">
      <h3 className="signup-header">회원가입</h3>
      <div className="signup-description">
        나에게 맞는 회원 유형을 선택해보세요!
      </div>
      <div className="user-type-container-wrapper">
        <div className="user-type-container">
          <div
            className={`user-type ${
              activeUserType === "COOKYER" ? "active" : ""
            }`}
            onClick={() => handleUserType("COOKYER")}
          >
            <img src="/cookyer.png" className="role-icon" />
            <div className="user-name">
              <div className="centered">Cookyer</div>
            </div>
            <div className="description">
              요리 영상을 제공하고
              <br />
              학생들에게 피드백을 해주는 선생님 회원
            </div>
          </div>

          <div
            className={`user-type ${
              activeUserType === "COOKIEE" ? "active" : ""
            }`}
            onClick={() => handleUserType("COOKIEE")}
          >
            <img src="/cookiee-user.png" className="role-icon" />
            <div className="user-name">
              <div className="centered">Cookiee</div>
            </div>
            <div className="description">
              선생님에게 실시간 맞춤형 피드백을
              <br />
              받을 수 있는 학생 회원
            </div>
          </div>
        </div>
      </div>
      <div className="signup-button" onClick={handleSignUpBtn}>
        회원가입
      </div>
      {modalOpen && (
        <AlertModal
          content="회원 유형을 선택해주세요."
          path={null}
          actions={handleCloseModal}
          data={false}
        />
      )}
    </div>
  );
}

export default SignUpBefore;

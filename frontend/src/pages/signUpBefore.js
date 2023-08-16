import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/auth/signUpBefore.css';

function SignUpBefore() {
  useEffect(() => {
    localStorage.clear()
  }, [])
  const navigate = useNavigate();
  const [activeUserType, setActiveUserType] = useState(null);

  const handleUserType = (userType) => {
    localStorage.setItem('userType', userType);
    setActiveUserType(userType);
  };
  const handleSignUpBtn = () => {
    if (!activeUserType) {
      alert('회원 유형을 선택해주세요.')
    } else {
      navigate("/signup");
    }
  }
  return (
    <div className='view'>
      <h3 className="signup-header">
        회원가입
      </h3>
      <div className="signup-description">
        나에게 맞는 회원 유형을 선택해보세요!
      </div>
      <div className="user-type-container-wrapper">
        <div className="user-type-container">
          <div
            className={`user-type ${activeUserType === 'COOKYER' ? 'active' : ''}`}
            onClick={() => handleUserType("COOKYER")}
          >
            {/* <div className='emoji'>
              👩‍🍳
            </div> */}
            <img src= "/cookyer.png" className='role-icon'/>
            <div className='user-name'>
              <div className='centered'>Cookyer</div>
            </div>
            <div className='description'>
              수업 영상을 제공하고
              <br />
              학생들에게 피드백을 해주는 선생님 회원
            </div>
          </div>

          <div
            className={`user-type ${activeUserType === 'COOKIEE' ? 'active' : ''}`}
            onClick={() => handleUserType("COOKIEE")}
          >
            {/* <div className='emoji'>
              🍪
            </div> */}
              <img src= "/cookiee-user.png" className='role-icon'/>
            <div className='user-name'>
              <div className='centered'>Cookiee</div>
            </div>
            <div className='description'>
              선생님에게 실시간 맞춤형 피드백을
              <br />
              받을 수 있는 학생 회원
            </div>
          </div>
        </div>
      </div>
      <div className='signup-button' onClick={handleSignUpBtn}>
        회원가입
      </div>
    </div>
  );
}

export default SignUpBefore;
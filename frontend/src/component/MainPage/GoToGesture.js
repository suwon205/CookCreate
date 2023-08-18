import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/mainpage/goToGesture.css';

function GoToGesture() {
  const navigate = useNavigate();
  const gotoGesture = () => {
    navigate("/gestureTest");
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }
  return (
    <div>
      <button onClick={gotoGesture} className="go-to-gesture-btn">제스처 인식 체험 해보기</button>
    </div>
  );
}

export default GoToGesture;
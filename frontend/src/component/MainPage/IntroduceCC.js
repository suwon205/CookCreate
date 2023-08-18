import React from 'react'
import '../../style/mainpage/introduceCC.css'

function IntroduceCC() {
  return (
    <div>
      <h3>
        How To be
      </h3>
      {/* 쿠커 */}
      <br />
      <div>
        <div className="introCC-title">
          👩‍🍳 Cookyer
        </div>
        <div className="introCC-content">
          <div>
            미리 촬영한 요리 영상을 활용하여 과외를 진행하고, 
            <br/>
            학생들이 요리하는 동안 실시간으로 피드백을 주는 선생님입니다.
            <br/>
            조리 자격증이나 사업자 등록증을 등록하고 인증 뱃지를 얻어보세요.
          </div>
        </div>
      </div>
      {/* 쿠키 */}
      <br />
      <div>
        <div className="introCC-title">
          🍪 Cookiee 
        </div>
        <div className="introCC-content">
          쿡크와 함께라면 집에서도 쉽게 요리 과외를 들을 수 있어요.
          <br/>
          쿡커에게 실시간 피드백을 받고, 요리를 하는동안 제스처 기능을 활용해
          <br/>
          화상과외를 편하게 제어해보세요.
        </div>
      </div>
    </div>
  );
}

export default IntroduceCC;
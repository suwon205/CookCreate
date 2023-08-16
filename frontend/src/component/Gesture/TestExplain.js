import React from "react";
import "./../../style/testVideo.css"

function TestExplain() {

    return(
        <>
            <div className="test-explain">
                <div className="test-explain-text">
                    <div>👌 오케이 표시로 타이머를 시작하세요!</div>
                    <div>✅ 완료되면 엄지와 검지를 펴서 체크업 하세요!</div>
                    <div>✋ 질문이 있으면 손을 번쩍 들어 질문하세요!</div>
                    {/* <div>(설명 CSS변경, 홈 되돌아가기 버튼 추가 예정)</div> */}
                </div>
                <div className="test-explain-reset">다시 놀고싶으면 Reset 버튼을 누르세요</div>
            </div>
        </>
    )
}

export default TestExplain;
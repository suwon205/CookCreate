import React from "react";
import { useSelector } from 'react-redux';
import TestScreen from "../../component/Video/TestScreen";
import Timer from "../../component/Video/Timer";
import ResetButton from "./../../component/Gesture/ResetButton";
import GoBackMain from "./../../component/Gesture/GoBackMain";
import TestExplain from "./../../component/Gesture/TestExplain";
import { IoIosHand } from "react-icons/io";
import { AiFillCheckCircle } from "react-icons/ai";

import '../../style/testVideo.css'

function GestureTest() {
    
    // const timerRdx = useSelector((state) => state.gestureTest.timer);
    const handRdx = useSelector((state) => state.gestureTest.hand);
    const checkRdx = useSelector((state) => state.gestureTest.check);

    return (
        <>
        <div className="test-video-title">제스처 테스트</div>
        <div className='test-content-video'>
            <TestScreen>
                {handRdx ? (<IoIosHand className='test-handsup-icon-active'/>) : (<IoIosHand className='test-handsup-icon'/>)}
                {checkRdx ? (<AiFillCheckCircle className='test-check-icon-active'/>) : (<AiFillCheckCircle className='test-check-icon'/>)}
            </TestScreen>
            <div className="right-column">
                <div className="timer-reset-container">
                    <Timer role={"COOKIEE"} size={"full"}isGestureTest={true}/> {/**Timer와 ResetButton 한 행 */}
                    <ResetButton/>
                    <TestExplain/>
                </div>
                <GoBackMain/> {/**얘만 한 행 */}
            </div>
        </div>
        </>
    );
}

export default GestureTest;
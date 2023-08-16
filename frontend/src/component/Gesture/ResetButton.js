import React from "react";
import { useDispatch } from "react-redux";
import { resetAll } from "./../../store/video/gestureTest";
import "./../../style/testVideo.css"

function ResetButton() {
    const dispatch = useDispatch();

    function resetTestPage() {
        dispatch(resetAll());
    }

    return (
        <>
            <button className="test-reset" onClick={resetTestPage}>Reset</button>
        </>
    );
}

export default ResetButton;
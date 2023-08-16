import React, { Component, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import HandLandMarker from "./../../component/Gesture/HandLandMarker";
import { DrawingUtils, HandLandmarker as abc } from "@mediapipe/tasks-vision";
import { setHandsUpTrue, setCheckTrue } from './../../store/video/cookieeVideo';
import { trigTimer } from './../../store/video/timer';

import '../../style/video.css'

function OpenViduVideoComponent(props) {
    const canvasRef = useRef(null);
    // const contextRef = useRef(null);
    const videoRef = useRef(null);

    const dispatch = useDispatch();

    const publisher = useSelector((state) => state.video.publisher)
    const isAudioPublished = useSelector((state) => state.video.isAudioPublished)

    const check = useSelector((state) => state.cookieeVideo.check) // 체크
    const handsUp = useSelector((state) => state.cookieeVideo.handsUp) // 손들기
    const timerCheck = useSelector((state) => state.timer.timerCheck) // 타이머

    // 캠에서 손이 한 번 보이고 사라지기 전 까지는 하나의 함수 당 하나만 작동하도록 flag 설정
    const [okCalled, okSetter] = useState(false);
    const [checkCalled, checkSetter] = useState(false);
    const [handCalled, handSetter] = useState(false);

    // 탐지를 1번만 했을 때 함수 호출 시 너무 민감하게 작동하므로 count를 n 이상 했을때만 함수 호출
    let handCount = 0;
    let checkCount = 0;
    let okCount = 0;

    const dist = (x1, y1, x2, y2) => {
      return Math.sqrt(Math.pow(x1 - x2, 2)) + Math.sqrt(Math.pow(y1 - y2, 2));
    }

    useEffect(() => {
      if (props && videoRef.current) {
        props.streamManager.addVideoElement(videoRef.current);
      }
    }, [props]);

    console.log(props.videoStyle);
    console.log(`canvasRef.current: ${canvasRef.current}`);
    console.log(`videoRef.current: ${videoRef.current}`);
    console.log(`props.gesture: ${props.gesture}`);

    useEffect(() => {
      if (canvasRef.current && videoRef.current && props.gesture) {
        console.log("두번째 useEffect 실행됨")
        const canvas = canvasRef.current;
        const video = videoRef.current;
        let gesture = "";

        // if (canvas) {
        //   contextRef.current = canvas.getContext("2d");
        // }
    
        if (/*contextRef.current &&*/ canvas && video ) {
          createHandLandmarker().then((handLandmarker) => {
            // const drawingUtils = new DrawingUtils(contextRef.current);
            let lastVideoTime = -1;
            let results = undefined;
    
            function predict() {
              
              // canvas.style.width = video.videoWidth;
              // canvas.style.height = video.videoHeight;
              // canvas.width = video.videoWidth;
              // canvas.height = video.videoHeight;

              let startTimeMs = performance.now();
              if (lastVideoTime !== video.currentTime) {
                lastVideoTime = video.currentTime;
                results = handLandmarker.detectForVideo(video, startTimeMs);
                // Perform gesture recognition
                const recognizedGesture = recognizeGesture(results);
                gesture = recognizedGesture ? recognizedGesture : "";
              }
    
              // contextRef.current.save();
              // contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
              // if (results.landmarks) {
              //   for (const landmarks of results.landmarks) {
              //     drawingUtils.drawConnectors(landmarks, abc.HAND_CONNECTIONS, {
              //       color: "#ffeb3b",
              //       lineWidth: 5,
              //     });
    
              //     drawingUtils.drawLandmarks(landmarks, {
              //       color: "#ff7f00",
              //       lineWidth: 5,
              //     });
              //   }
              // }
              // // Display recognized gesture
              // contextRef.current.font = "30px Arial";
              // contextRef.current.fillStyle = "#00FF00";
              // contextRef.current.fillText(`${gesture}`, 10, 30);
              // contextRef.current.restore();
    
              window.requestAnimationFrame(predict);
            }
    
            navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => { //  mediapipe로 주나?
              video.srcObject = stream;
              video.addEventListener("loadeddata", predict);
            });
            
          });
        }
      }
    }, []); // 얘 [] 없애야할수도
  
    const createHandLandmarker = async () => {
      const handLandmarker = await HandLandMarker();
      return handLandmarker;
    };
  
    const recognizeGesture = (results) => {
      if (props.gesture !== true) {
        return;
      }
      const compareIndex = [[17, 4], [6, 8], [10, 12], [14, 16], [18, 20]]; // [0][0] 원래는 18이었음. 다른 숫자들로 테스트 해보자.
      const open = [false, false, false, false, false];
      const gesture = ['🖐️', '👌', '✅'] // 엄지 검지 V 이모지가 안보이네
      let isThumbIndexTouched = false; // 엄지 검지 맞닿아있는지 여부 (OK싸인 제스쳐 탐지에 활용) << 얘가 true이고 3, 4, 5번 compareIndex가 True이면 'OK사인' 제스쳐 보내기로 활용할 것

      if (results.landmarks && results.landmarks.length > 0) {
        const landmarks = results.landmarks[0];
        
        if (landmarks.length >= 21) {
          // 엄지는 생긴게 특이하므로 얘만 따로 구현
          open[0] = dist(landmarks[3].x, landmarks[3].y, landmarks[17].x, landmarks[17].y) < dist(landmarks[4].x, landmarks[4].y, landmarks[17].x, landmarks[17].y);
          for (let i = 1; i < 5; i++) { // 2~5번째 손가락 접힘 여부 탐지
						open[i] = dist(landmarks[0].x, landmarks[0].y, landmarks[compareIndex[i][0]].x, landmarks[compareIndex[i][0]].y) < dist(landmarks[0].x, landmarks[0].y, landmarks[compareIndex[i][1]].x, landmarks[compareIndex[i][1]].y);
          }
          // OK제스처 탐지를 위해 엄지와 검지 맞닿았는지 탐지
          isThumbIndexTouched = dist(landmarks[4].x, landmarks[4].y, landmarks[8].x, landmarks[8].y) < dist(landmarks[4].x, landmarks[4].y, landmarks[3].x, landmarks[3].y);
					if (open[0] === true && open[1] === true && open[2] === false && open[3] === false && open[4] === false) {
						checkCount += 1;
					}

					if (isThumbIndexTouched === true && open[2] === true && open[3] === true && open[4] === true) {
						okCount += 1;
					}
					else if (open[0] === true && open[1] === true && open[2] === true && open[3] === true && open[4] === true) {
						handCount += 1;
					}

          if (checkCount >= 10 && checkCalled === false) {
            pressCheckTrue(publisher);
            console.log('debug: setHandsup 호출시도');
            checkSetter(true);
          }
					if (handCount >= 10 && handCalled === false) {
            pressHandsUpTrue(publisher);
            console.log('debug : handSetter 호출시도');
            handSetter(true);
          }
          if (okCount >= 10 && okCalled === false) {
            startTimer(publisher);
            console.log('debug: startTimer 호출시도');
            okSetter(true); // 이 세터들 안필요한거 같은데 기술부채 갚을 때 지우는거 고려해보자
          }
          console.log(open)
          console.log(isThumbIndexTouched)
        } 
      } else {
        handSetter(false);
        checkSetter(false);
        okSetter(false);
        handCount = 0;
        checkCount = 0;
        okCount = 0;
      }
    };

    const pressCheckTrue = () => {
      dispatch(setCheckTrue());
    }

    const pressHandsUpTrue = () => {
      dispatch(setHandsUpTrue());
    }

    const startTimer = () => {
      dispatch(trigTimer());
    }
  
    return (
      <>
        <video
          className={props.videoStyle}
          muted={true}
          autoPlay={true}
          ref={videoRef}
        ></video>
        <canvas
          ref={canvasRef}
          style={{display:"none"}}
        ></canvas>
        </>
    );
  };
  
  export default OpenViduVideoComponent;
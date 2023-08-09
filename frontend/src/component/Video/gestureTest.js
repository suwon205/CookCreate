import React, { useEffect, useRef } from "react";
import HandLandMarker from "./../Components/HandLandMarker"; // 수정하기
import { DrawingUtils, HandLandmarker as abc } from "@mediapipe/tasks-vision";

const App = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const inputVideoRef = useRef(null);

  // 탐지를 1번만 했을 때 함수 호출 시 너무 민감하게 작동하므로 count를 n 이상 했을때만 함수 호출
  let handCount = 0;
  let checkCount = 0;
  let okCount = 0;

  const dist = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x1 - x2, 2)) + Math.sqrt(Math.pow(y1 - y2, 2));
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const videoRef = inputVideoRef.current;
    let gesture = "";

    if (canvas) {
      contextRef.current = canvas.getContext("2d");
    }

    if (contextRef.current && canvas && videoRef) {
      createHandLandmarker().then((handLandmarker) => {
        // console.log(handLandmarker);
        const drawingUtils = new DrawingUtils(contextRef.current);
        let lastVideoTime = -1;
        let results = undefined;

        function predict() {
          canvas.style.width = videoRef.videoWidth;
          canvas.style.height = videoRef.videoHeight;
          canvas.width = videoRef.videoWidth;
          canvas.height = videoRef.videoHeight;

          let startTimeMs = performance.now();
          if (lastVideoTime !== videoRef.currentTime) {
            lastVideoTime = videoRef.currentTime;
            results = handLandmarker.detectForVideo(videoRef, startTimeMs);
            console.log(results);
            // Perform gesture recognition
            const recognizedGesture = recognizeGesture(results);
            gesture = recognizedGesture ? recognizedGesture : "";
          }

          contextRef.current.save();
          contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
          if (results.landmarks) {
            for (const landmarks of results.landmarks) {
              drawingUtils.drawConnectors(landmarks, abc.HAND_CONNECTIONS, {
                color: "#FFF000",
                lineWidth: 5,
              });

              drawingUtils.drawLandmarks(landmarks, {
                color: "#00FF00",
                lineWidth: 5,
              });
            }
          }
          // Display recognized gesture
          contextRef.current.font = "30px Arial";
          contextRef.current.fillStyle = "#00FF00";
          contextRef.current.fillText(`${gesture}`, 10, 30);
          contextRef.current.restore();

          window.requestAnimationFrame(predict);
        }

        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          videoRef.srcObject = stream;
          videoRef.addEventListener("loadeddata", predict);
        });
      });
    }
  }, []);

  const createHandLandmarker = async () => {
    const handLandmarker = await HandLandMarker();
    return handLandmarker;
  };

  const recognizeGesture = (results) => {
    const compareIndex = [[17, 4], [6, 8], [10, 12], [14, 16], [18, 20]]; // [0][0] 원래는 18이었음. 다른 숫자들로 테스트 해보자.
    const open = [false, false, false, false, false];
    const gesture = ['✅', '👌', '🖐️'] // 엄지 검지 V 이모지가 안보이네
    let isThumbIndexTouched = false; // 엄지 검지 맞닿아있는지 여부 (OK싸인 제스쳐 탐지에 활용) << 얘가 true이고 3, 4, 5번 compareIndex가 True이면 'OK사인' 제스쳐 보내기로 활용할 것
    let ans;
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
						ans = 0;
					}

					if (isThumbIndexTouched === true && open[2] === true && open[3] === true && open[4] === true) {
						ans = 1;
					}
					else if (open[0] === true && open[1] === true && open[2] === true && open[3] === true && open[4] === true) {
						ans = 2;
					}
        } 
      }

      return gesture[ans];
    };

  return (
    <>
      <div style={{ position: "relative" }}>
        <video
          id="webcam"
          style={{ position: "absolute" }}
          autoPlay
          playsInline
          ref={inputVideoRef}
        ></video>
<canvas
          ref={canvasRef}
          id="output_canvas"
          style={{ position: "absolute", left: "0px", top: "0px" }}
        ></canvas>
      </div>
    </>
  );
};

export default App;

// 이제 여기에 
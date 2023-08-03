import React, { useEffect, useState } from 'react';

import '../../style/video.css'
import { useDispatch, useSelector } from 'react-redux';
import { audioMute, leaveSession, videoMute } from '../../store/video/video';
import { useNavigate } from 'react-router-dom';
import { setScreenShareActive, setStreamManager } from '../../store/video/screenShare';
import axios from 'axios';
import { setCheck } from '../../store/video/cookieeVideo';
import { closeSession } from '../../store/video/video-thunk';

function VideoSideBar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const OV = useSelector((state) => state.video.OV)
  const session = useSelector((state) => state.video.session)
  const publisher = useSelector((state) => state.video.publisher)
  const streamManager = useSelector((state) => state.screenShare.streamManager)
  const [ isShared, setIsShared ] = useState(false)

  const OvToken = useSelector((state) => state.video.OvToken)
  const videoLessonId = useSelector((state) => state.video.videoLessonId)
  // const access_token = localStorage.getItem('access_token')
  const access_token = useSelector((state) => state.auth.access_token)
  const isSessionClosed = useSelector((state) => state.video.isSessionClosed)

  const role = localStorage.getItem('role')

  /** 체크 도전 */
  const check = useSelector((state) => state.cookieeVideo.check)

  const handleCloseSession = () => {
    if (OvToken !== undefined) {
      console.log("레슨번호", videoLessonId)
      console.log(access_token, "삭제시도")
      axios.delete(
        `http://localhost:4443/openvidu/api/sessions/${session.sessionId}`,
        {
          headers: {
            Authorization:
              'Basic ' + btoa('OPENVIDUAPP:MMT_SECRET'),
          }
        })
        .then((res) => {
          const data = {
            access_token, lessonId: videoLessonId
          }
          dispatch(closeSession(data))
          console.log('세션 종료 성공', res)
        })
        .catch((err) => {
          console.log('세션 종료 실패', err)
        })
    } else {
      console.log("비정상적인 접근. 어떻게 여기에..?")
    }
  }

  useEffect(() => {
    if (role === 'COOKYER' && isSessionClosed) {
      navigate('/')
    }
  }, [isSessionClosed])

  // unpublish 해놓고 세션 등 정보가 유지되어 있는 상태로 나가기
  const handleLeaveSession = () => {
    
    navigate('/')
  }

  // const handleScreenShare = () => {
  //   setIsShared(true)
  //   console.log('화면공유', 'true', isShared)
  //   // 취소를 눌렀을땐 false여야 하는데 어떻게 그렇게 하지..?
  // }

  // const handleStopScreenShare = () => {
  //   setIsShared(false)
  // }

  const setVideoMute = () => {
    dispatch(videoMute())
  }

  const setAudioMute = () => {
    dispatch(audioMute())
  }

  useEffect(() => {
    // componentDidMount
    window.addEventListener('beforeunload', onbeforeunload);

    // componentWillUnmount
    return () => {
      window.removeEventListener('beforeunload', onbeforeunload);
    };
  }, []);

  const onbeforeunload = (e) => {
    dispatch(leaveSession())  // 수정필요
  }

  // /** 화면공유 */
  // useEffect(() => {
  //   console.log('화면공유 할말?', isShared)
  //   if (isShared) {
  //     const sharedPublisher = OV.initPublisher(
  //       undefined,
  //       {
  //         // videoSource: videoSource,
  //         videoSource: 'screen',
  //         publishAudio: true,
  //         publishVideo: true,
  //         mirror: false,
  //         resolution: '640x480', // The resolution of your video
  //         frameRate: 30, // The frame rate of your video
  //         insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
  //       },
  //       (error) => {
  //         if (error && error.name === 'SCREEN_EXTENSION_NOT_INSTALLED') {
  //           alert('screen extension not installed')
  //             // this.setState({ showExtensionDialog: true });
  //         } else if (error && error.name === 'SCREEN_SHARING_NOT_SUPPORTED') {
  //           alert('Your browser does not support screen sharing');
  //         } else if (error && error.name === 'SCREEN_EXTENSION_DISABLED') {
  //           alert('You need to enable screen sharing extension');
  //         } else if (error && error.name === 'SCREEN_CAPTURE_DENIED') {
  //           alert('You need to choose a window or application to share');
  //         }
  //       },
  //     )

  //     console.log("initPublisher 이후")
  //     sharedPublisher.once('accessAllowed', () => {
  //       console.log("화면공유 여기까지 오니?", sharedPublisher.stream.connection.data)
  //       session.unpublish(publisher);
  //       // session.unpublish(streamManager);
  //       dispatch(setStreamManager({sharedPublisher}))
  //       session.publish(sharedPublisher).then(() => {
  //         dispatch(setScreenShareActive(true));
  //         console.log("시그널 보냈나?")
  //         // sendSignalUserChanged({ isScreenShareActive: screenShareActive });
  //         sendSignalUserChanged({ isScreenShareActive: true });
  //       })
  //     });
  //     // publisher.on('streamPlaying', () => {
  //     //     this.updateLayout();
  //     //     publisher.videos[0].video.parentElement.classList.remove('custom-class');
  //     // });
      
  //   } else {
  //     dispatch(setStreamManager({sharedPublisher: null}))

  //     session.unpublish(streamManager)
  //     console.log("공유화면 unpublish")
  //     session.publish(publisher)
  //     console.log('웹캡화면 publish')
  //   }
  // }, [isShared])

  // const sendSignalUserChanged = (data) => {
  //   const signalOptions = {
  //       data: JSON.stringify(data),
  //       type: 'sharedScreen',
  //   };
  //   console.log("시그널 보냈니???")
  //   session.signal(signalOptions);
  // }

  /** 체크 */
  // 쿠키가 체크를 누르면 쿠커에게 시그널을 보내고, 쿠커가 리셋하면 쿠키에게 시그널을 보내야 함
  // 쿠키가 체크를 누름
  const pressCheck = () => {
    dispatch(setCheck())
  }

  useEffect(() => {
    if (check) {
      const data = {
        connectionId: publisher.stream.connection.connectionId
      }
      console.log("체크했다", data)
      publisher.stream.session.signal({
        data: JSON.stringify(data),
        type: 'check'
      })
    } else {
      console.log("선생님이 체크 리셋")
      // 학생이 체크 리셋해제하면 선생님에게 또 신호를 보내야함(아직안함)
    }
  }, [check])

  return (
    <div className='video-sidebar'>
      <button
        onClick={handleLeaveSession}
      >
        (잠시) 나가기
      </button>
      { role === 'COOKYER' ? (
        <button
          onClick={handleCloseSession}
        >
          수업 끝내기
        </button>
      ) : null}
      <button
        onClick={setAudioMute}
      >
        음소거
      </button>
      <button
        onClick={setVideoMute}
      >
        화면뮤트
      </button>
      
      { role === 'COOKYER' ? (
        <button
          // onClick={isShared ? handleStopScreenShare : handleScreenShare}
        >
          화면공유
        </button>
      ) : null}

      { role === 'COOKIEE' ? (
        <button
          onClick={() => pressCheck(publisher)}
        >
          체크
        </button>
      ) : null}
      { role === 'COOKIEE' ? (
        <button
          // onClick={sendRaiseSignal}
          // onClick={isRaised ? handleStopRaiseHand : handleRaiseHand}
        >
          손들기
        </button>
      ) : null}
      
    </div>
  );
}

export default VideoSideBar;
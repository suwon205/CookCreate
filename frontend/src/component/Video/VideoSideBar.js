import React, { useEffect, useState } from 'react';

import '../../style/video.css'
import { useDispatch, useSelector } from 'react-redux';
import { audioMute, leaveSession, videoMute } from '../../store/video/video';
import { useNavigate } from 'react-router-dom';
import { setScreenShareActive, setStreamManager } from '../../store/video/screenShare';

function VideoSideBar() {
  const dispatch = useDispatch()
  const navigator = useNavigate()

  const OV = useSelector((state) => state.video.OV)
  const session = useSelector((state) => state.video.session)
  const publisher = useSelector((state) => state.video.publisher)
  const streamManager = useSelector((state) => state.screenShare.streamManager)
  const [ isShared, setIsShared ] = useState(false)

  const role = localStorage.getItem('role')

  /** 체크 도전 */
  // const check = useSelector((state) => state.cookieeVideo.check)

  const handleLeaveSession = () => {
    if (session) {
      session.disconnect()
      dispatch(leaveSession())
    }
    navigator('/')
  }

  // const handleScreenShare = () => {
  //   setIsShared(true)
  //   console.log('화면공유', 'true', isShared)
  //   // 취소를 눌렀을땐 false여야 하는데 어떻게 그렇게 하지..?
  // }

  const handleStopScreenShare = () => {
    setIsShared(false)
  }

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
  // 쿠키가 체크를 누르면 쿠커에게 시그널을 보내고, 쿠커가 리셋하면 쿠키에게 시그널을 보내야 함함
  // 쿠키가 체크를 누름
  // const pressCheck = () => {
  //   dispatch(setCheck())
  // }

  return (
    <div className='video-sidebar'>
      <button
        onClick={handleLeaveSession}
      >
        나가기
      </button>
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
          // onClick={() => pressCheck(publisher)}
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
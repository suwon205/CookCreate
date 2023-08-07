import React, { useEffect, useState } from 'react';

import '../../../style/video.css'
import { useDispatch, useSelector } from 'react-redux';
import { audioMute, leaveSession, setIsExited, videoMute } from '../../../store/video/video';
import { useNavigate } from 'react-router-dom';
import { setShareScreenPublisher } from '../../../store/video/screenShare';
import axios from 'axios';
import { closeSession, shareScreen } from '../../../store/video/video-thunk';

function CookyerVideoSideBar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const OV = useSelector((state) => state.video.OV)
  const session = useSelector((state) => state.video.session)
  const publisher = useSelector((state) => state.video.publisher)
  const isAudioPublished = useSelector((state) => state.video.isAudioPublished)
  
  /** 화면 공유 기능 */
  const shareScreenPublisher = useSelector((state) => state.screenShare.shareScreenPublisher)
  const [ isShared, setIsShared ] = useState(false)
  
  /** 세션 나가기 */
  const sessionId = useSelector((state) => state.video.sessionId)
  const videoLessonId = useSelector((state) => state.video.videoLessonId)
  const access_token = localStorage.getItem('access_token')

  const isExited = useSelector((state) => state.video.isExited)

  /** 과외방 닫기 */
  const handleCloseSession = () => {
    if (sessionId !== undefined) {
    // if (session.sessionId) {
      console.log("레슨번호", videoLessonId)
      console.log(access_token, "삭제시도")
      axios.delete(
        `http://localhost:4443/openvidu/api/sessions/${session.sessionId}`,
        // `https://i9c111.p.ssafy.io:8447/openvidu/api/sessions/${session.sessionId}`,
        {
          headers: {
            Authorization:
              'Basic ' + btoa('OPENVIDUAPP:MMT_SECRET'),
          }
        })
        .then((res) => {
          session.disconnect()
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

  // 쿠커이고 세션을 닫았으면 메인페이지로 이동 -> 진행단계 마지막으로 확인할 수 있도록 수정!?
  // useEffect(() => {
  //   if (role === 'COOKYER' && !isSessionOpened) {
  //     navigate('/')
  //   }
  // }, [isSessionOpened])

  // unpublish 해놓고 세션 등 정보가 유지되어 있는 상태로 나가기 -> 들어올때 버튼 따로 만들어야 함. 값이 있으면 요청 안하는 걸로?
  const handleLeaveSession = () => {
    dispatch(setIsExited(true))
  }

  useEffect(() => {
    if (isExited) {
      if (document.fullscreenElement) {
        document
          .exitFullscreen()
          .then(() => console.log("Document Exited from Full screen mode"))
          .catch((err) => console.error(err));
      }
      navigate('/')
    }
  }, [isExited])

  /** 화면 공유 */
  const handleScreenShare = () => {
    console.log("handleScreenShare", shareScreenPublisher)
    if (shareScreenPublisher === null) {
      if (isShared) {
        setIsShared(false)
      } else {
        setIsShared(true)
        console.log("화면공유하기")
      }
    } else {
      setIsShared(false)
      console.log("화면공유 취소")
    }
  }

  useEffect(() => {
    if (isShared) {
      console.log("화면공유 시작")
      dispatch(shareScreen({OV}))
    } else {
      if (shareScreenPublisher) {  // 공유된 상태일때만
        session.unpublish(shareScreenPublisher)
        session.publish(publisher)
        dispatch(setShareScreenPublisher(null))
        console.log("화면공유 종료")
      }
    }
  }, [isShared])

  useEffect(() => {
    if (shareScreenPublisher !== null) {
      shareScreenPublisher.once('accessAllowed', () => {
        console.log("화면공유 여기까지 오니?", shareScreenPublisher.stream)
        session.unpublish(publisher);
        dispatch(setShareScreenPublisher(shareScreenPublisher))
        session.publish(shareScreenPublisher).then(() => {
          console.log("화면공유 퍼블리셔 발행 성공")
          // sendSignalUserChanged({ isScreenShareActive: true });
        })
      });
    }
  }, [shareScreenPublisher])

  // 쿠커가 화면공유하면 쿠키에게 시그널보냄
  // 퍼블리셔만 갈아끼우는 지금은 필요없음
  // const sendSignalUserChanged = (data) => {
  //     const signalOptions = {
  //         data: JSON.stringify(data),
  //         type: 'sharedScreen',
  //     };
  //     console.log("쿠커가 쿠키에게 화면공유 시그널 보냄")
  //     session.signal(signalOptions);
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

  /** 쿠키 전체 음소거 */
  const handleCookieeAudio = () => {
    publisher.stream.session.signal({
      type: 'forceAudioMute'
    })
  }

  return (
    <div className='video-sidebar'>
      <button
        onClick={handleLeaveSession}
      >
        (잠시) 나가기
      </button>
      <button
        onClick={handleCloseSession}
      >
        수업 끝내기
      </button>
      <button
        onClick={setAudioMute}
      >
        {isAudioPublished ? ('소리켜짐') : ('소리꺼짐')}
      </button>
      <button
        onClick={setVideoMute}
      >
        화면뮤트
      </button>
      <button
        onClick={handleScreenShare}
      >
        화면공유
      </button>
      <button
        onClick={() => handleCookieeAudio(publisher)}
      >
        쿠키 전체 음소거
      </button>
    </div>
  );
}

export default CookyerVideoSideBar;
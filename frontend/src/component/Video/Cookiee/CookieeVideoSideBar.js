import React, { useEffect } from 'react';

import '../../../style/video.css'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { audioMute, leaveSession, videoMute } from '../../../store/video/video';
import { setCheck, setHandsUp } from '../../../store/video/cookieeVideo';

function CookieeVideoSideBar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const publisher = useSelector((state) => state.video.publisher)
  const isAudioPublished = useSelector((state) => state.video.isAudioPublished)

  /** 체크 기능 */
  const check = useSelector((state) => state.cookieeVideo.check)

  /** 손들기 기능 */
  const handsUp = useSelector((state) => state.cookieeVideo.handsUp)

  const handleLeaveSession = () => {
    if (document.fullscreenElement) {
      document
        .exitFullscreen()
        .then(() => console.log("Document Exited from Full screen mode"))
        .catch((err) => console.error(err));
    }
    navigate('/')
  }

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

  /** 체크 */
  const pressCheck = () => {
    dispatch(setCheck())
  }

  useEffect(() => {
    if (publisher) {
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
        const data = {
          connectionId: publisher.stream.connection.connectionId
        }
        console.log("체크해제했다", data)
        publisher.stream.session.signal({
          data: JSON.stringify(data),
          type: 'uncheck'
        })
      }
    }
  }, [check])

  const pressHandsUp = () => {
    dispatch(setHandsUp())
  }

  useEffect(() => {
    if (publisher) {
      if (handsUp) {
        const data = {
          connectionId: publisher.stream.connection.connectionId
        }
        console.log("손들었다", data)
        publisher.stream.session.signal({
          data: JSON.stringify(data),
          type: 'handsUp'
        })
      } else {
        const data = {
          connectionId: publisher.stream.connection.connectionId
        }
        console.log("손내렸다", data)
        publisher.stream.session.signal({
          data: JSON.stringify(data),
          type: 'handsDown'
        })
      }
    }
  }, [handsUp])

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
        {isAudioPublished ? ('소리켜짐') : ('소리꺼짐')}
      </button>
      <button
        onClick={setVideoMute}
      >
        화면뮤트
      </button>
      <button
        onClick={() => pressCheck(publisher)}
      >
        {check ? ('체크 해제') : ('체크하기')}
      </button>
      <button
        onClick={() => pressHandsUp(publisher)}
      >
        {handsUp ? ('손 내리기') : ('손 들기')}
      </button>
    </div>
  );
}

export default CookieeVideoSideBar;
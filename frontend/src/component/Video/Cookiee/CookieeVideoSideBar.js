import React, { useEffect } from 'react';

import '../../../style/video.css'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { audioMute, leaveSession, videoMute } from '../../../store/video/video';
import { setCheck, setHandsUp, setShowOthers } from '../../../store/video/cookieeVideo';
import { BsMicFill, BsMicMute, BsCameraVideoFill, BsCameraVideoOff, BsPeopleFill } from "react-icons/bs"
import { RxExit } from "react-icons/rx"
import { AiFillCheckCircle } from 'react-icons/ai'
import { IoIosHand } from 'react-icons/io'

function CookieeVideoSideBar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const publisher = useSelector((state) => state.video.publisher)
  const isVideoPublished = useSelector((state) => state.video.isVideoPublished)
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

  /** 다른 참가자 목록 보기 */
  const handleShowOthers = () => {
    dispatch(setShowOthers())
  }

  return (
    <div className='video-sidebar'>
      {/* 나가기 */}
      <div className='video-side-icon-wrap' onClick={handleLeaveSession}>
        <RxExit className='video-side-icon video-exit-icon'/>
      </div>
      {/* 화면뮤트 */}
      <div className='video-side-icon-wrap' onClick={setVideoMute}>
        {isVideoPublished ? (
          <BsCameraVideoFill className='video-side-icon'/>
        ) : (
          <BsCameraVideoOff className='video-side-icon'/>
        )}
      </div>
      {/* 소리뮤트 */}
      <div className='video-side-icon-wrap' onClick={setAudioMute}>
        {isAudioPublished ? (
          <BsMicFill className='video-side-icon'/>
        ) : (
          <BsMicMute className='video-side-icon'/>
        )}
      </div>
      {/* 체크 */}
      <div className='video-side-icon-wrap' onClick={() => pressCheck(publisher)}>
        {check ? (
          <AiFillCheckCircle className='video-side-icon'/>
        ) : (
          <AiFillCheckCircle className='video-side-icon'/>
        )}
      </div>
      {/* 손들기 */}
      <div className='video-side-icon-wrap' onClick={() => pressHandsUp(publisher)}>
        {handsUp ? (
          <IoIosHand className='video-side-icon'/>
        ) : (
          <IoIosHand className='video-side-icon'/>
        )}
      </div>
      {/* 다른 쿠키 목록 */}
      <div className='video-side-icon-wrap' onClick={handleShowOthers}>
        <BsPeopleFill className='video-side-icon'/>
      </div>
    </div>
  );
}

export default CookieeVideoSideBar;
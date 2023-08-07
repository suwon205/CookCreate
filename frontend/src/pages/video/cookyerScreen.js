import React, { useEffect } from 'react';
import VideoHeader from '../../component/Video/VideoHeader';
import UserVideoComponent from '../../component/Video/UserVideoComponent';
import Timer from '../../component/Video/Timer';
import CookyerLessonStep from '../../component/Video/Cookyer/CookyerLessonStep';
import LessonStepModal from '../../component/Video/Cookyer/LessonStepModal';
import CookyerVideoSideBar from '../../component/Video/Cookyer/CookyerVideoSideBar';

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSubscriber, enteredSubscriber, setAudioOffStream, setAudioOnList, setAudioOnStream } from '../../store/video/video';
import { joinSession } from '../../store/video/video-thunk';
import { setCheckCookiee, setCheckCookieeList, setHandsDownCookiee, setHandsUpCookiee, setHandsUpCookieeList, setUncheckCookiee } from '../../store/video/cookyerVideo';
import { setLessonInfo } from '../../store/video/videoLessonInfo';
import '../../style/video.css'

import { AiFillCheckCircle } from 'react-icons/ai'
import { IoIosHand } from 'react-icons/io'
import { BsMicFill, BsMicMuteFill } from "react-icons/bs";

function CookyerScreen() {
  const dispatch = useDispatch()
  
  const OV = useSelector((state) => state.video.OV)
  const session = useSelector((state) => state.video.session)
  const publisher = useSelector((state) => state.video.publisher)
  const subscribers = useSelector((state) => state.video.subscribers)

  /** 화면공유 */
  const shareScreenPublisher = useSelector((state) => state.screenShare.shareScreenPublisher)

  const sessionId = useSelector((state) => state.video.sessionId)
  const nickname = localStorage.getItem('nickname');
  const role = localStorage.getItem('role')

  /** 레슨 정보 */
  const access_token = localStorage.getItem('access_token')
  const videoLessonId = useSelector((state) => state.video.videoLessonId)

  /** 체크 */
  const checkCookieeList = useSelector((state) => state.cookyerVideo.checkCookieeList)
  const checkCookiee = useSelector((state) => state.cookyerVideo.checkCookiee)
  const uncheckCookiee = useSelector((state) => state.cookyerVideo.uncheckCookiee)

  /** 손들기 */
  const handsUpCookieeList = useSelector((state) => state.cookyerVideo.handsUpCookieeList)
  const handsUpCookiee = useSelector((state) => state.cookyerVideo.handsUpCookiee)
  const handsDownCookiee = useSelector((state) => state.cookyerVideo.handsDownCookiee)

  /** 진행 단계 관련 모달 */
  const isSessionOpened = useSelector((state) => state.video.isSessionOpened)

  /** 참가자 소리 상태 확인 */
  const audioOnList = useSelector((state) => state.video.audioOnList)
  const audioOnStream = useSelector((state) => state.video.audioOnStream)
  const audioOffStream = useSelector((state) => state.video.audioOffStream)

  /** 자동 전체 화면 */
  useEffect(() => {
    const element = document.documentElement; // 전체 화면으로 변경하고자 하는 요소
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }, []);

  useEffect(() => {
    console.log(3, session)
    if (session) {
      // console.log("세션 바뀜")
      // On every new Stream received...
      const handleStreamCreated = (event) => {
        const subscriber = session.subscribe(event.stream, undefined);
        dispatch(enteredSubscriber(subscriber))
      };

      // On every Stream destroyed...
      const handleStreamDestroyed = (event) => {
        dispatch(deleteSubscriber(event.stream.streamManager))
      };

      // On every asynchronous exception...
      const handleException = (exception) => {
        console.warn(exception);
      };

      session.on('streamCreated', handleStreamCreated);
      session.on('streamDestroyed', handleStreamDestroyed);
      session.on('exception', handleException);

      /** 체크 이벤트 추가 */
      session.on('signal:check', (e) => {
        const connectionId = JSON.parse(e.data).connectionId
        console.log('체크한 사람', connectionId)
        dispatch(setCheckCookiee(connectionId))
      })

      /** 체크 해제 이벤트 추가 */
      session.on('signal:uncheck', (e) => {
        const connectionId = JSON.parse(e.data).connectionId
        console.log('체크 해제한 사람', connectionId)
        dispatch(setUncheckCookiee(connectionId))
      })

      /** 손들기 이벤트 추가 */
      session.on('signal:handsUp', (e) => {
        const connectionId = JSON.parse(e.data).connectionId
        console.log('손 든 사람', connectionId)
        dispatch(setHandsUpCookiee(connectionId))
      })

      /** 손들기 해제 이벤트 추가 */
      session.on('signal:handsDown', (e) => {
        const connectionId = JSON.parse(e.data).connectionId
        console.log('손 내린 사람', connectionId)
        dispatch(setHandsDownCookiee(connectionId))
      })

      /** 참가자 소리 조정 이벤트 추가 */
      session.on('signal:audioOn', (e) => {
        const connectionId = JSON.parse(e.data).connectionId
        console.log('소리 켠 사람', connectionId)
        dispatch(setAudioOnStream(connectionId))
      })

      session.on('signal:audioOff', (e) => {
        const connectionId = JSON.parse(e.data).connectionId
        console.log('소리 끈 사람', connectionId)
        dispatch(setAudioOffStream(connectionId))
      })

      console.log(4)
      const data = {
        OV,
        session,
        sessionId,
        nickname,
        role
      }
      dispatch(joinSession(data))
      // dispatch(publishStream(data))

      console.log(5)

      // Clean-up 함수 등록
      return () => {
        session.off('streamCreated', handleStreamCreated);
        session.off('streamDestroyed', handleStreamDestroyed);
        session.off('exception', handleException);
        const mySession = session;
        if (mySession) {
          mySession.disconnect(); // 예시에서는 disconnect()로 대체하였으나, 이는 OpenVidu에 따라 다르게 적용될 수 있음
        }
      };
    }
  }, []);

  useEffect(() => {
    if (videoLessonId) {
      axios.get(
        `/api/v1/lesson/${videoLessonId}`,
        {
          headers : {
            Access_Token : access_token
          }
        })
        .then((res) => {
          console.log(res.data)
          console.log('화상 과외 수업 정보 받아와짐')
          // setMyLesson(res.data) // 토큰이랑 커넥션 설정하는걸로 바꾸기?
          dispatch(setLessonInfo(res.data))
        })
        .catch((err) => {
          console.log(err)
          console.log('화상 과외 수업 정보 안받아와짐')
        })
    }
  }, [videoLessonId])

  /** 체크한 쿠키 리스트에 추가 */
  useEffect(() => {
    console.log("체크한 쿠키 리스트에 추가", checkCookiee)
    if (checkCookiee !== undefined && checkCookiee !== '') {
      // 만약 체크한 사람이 또 체크하면 거르기
      if (checkCookieeList !== [] && checkCookieeList !== undefined) {
        const newCheckCookieeList = checkCookieeList.filter((item) => {
          // console.log(item, "아이템")
          return item !== checkCookiee
        })
        newCheckCookieeList.push(checkCookiee)
        dispatch(setCheckCookieeList(newCheckCookieeList))
        console.log(newCheckCookieeList, "새 체크 리스트")
      } else {
        dispatch(setCheckCookieeList([checkCookiee]))
        console.log(checkCookieeList, "체크리스트에 값 없음")
      }
      dispatch(setCheckCookiee(''))
    }
  }, [checkCookiee])

  /** 체크 해제한 쿠키 리스트에서 제거 */
  useEffect(() => {
    console.log('체크 해제한 쿠키 리스트에서 제거', uncheckCookiee)
    if (checkCookieeList !== undefined && uncheckCookiee !== '') {
      const newCheckCookieeList = checkCookieeList.filter((item) => {
        return item !== uncheckCookiee
      })
      dispatch(setCheckCookieeList(newCheckCookieeList))
      console.log(newCheckCookieeList, '체크 해제한 사람 제외 새 체크 리스트')
      dispatch(setUncheckCookiee(''))
    }
  }, [uncheckCookiee])

  /** 손 든 쿠키 리스트에 추가 */
  useEffect(() => {
    console.log('손든 쿠키 리스트에 추가', handsUpCookiee)
    if (handsUpCookiee !== undefined && handsUpCookiee !== '') {
      // 만약 손든 사람이 또 손들면 거르기
      if (handsUpCookieeList !== undefined && handsUpCookieeList !== []) {
        const newHandsUpCookieeList = handsUpCookieeList.filter((item) => {
          return item !== handsUpCookiee
        })
        newHandsUpCookieeList.push(handsUpCookiee)
        dispatch(setHandsUpCookieeList(newHandsUpCookieeList))
        console.log(newHandsUpCookieeList, "새 손들기 리스트")
      } else {
        dispatch(setCheckCookieeList([handsUpCookiee]))
        console.log(handsUpCookieeList, "손들기리스트에 값 없음")
      }
      dispatch(setHandsUpCookiee(''))
    }
  }, [handsUpCookiee])

  /** 손 내린 쿠키 리스트에서 제거 */
  useEffect(() => {
    console.log('손 내릴 쿠키 리스트에서 제거', handsDownCookiee)
    if (handsUpCookieeList !== undefined && handsDownCookiee !== '') {
      const newHandsUpCookieeList = handsUpCookieeList.filter((item) => {
        return item !== handsDownCookiee
      })
      dispatch(setHandsUpCookieeList(newHandsUpCookieeList))
      console.log(newHandsUpCookieeList, "손 내린 사람 제외 새 손들기 리스트")
      dispatch(setHandsDownCookiee(''))
    }
  }, [handsDownCookiee])

  const resetHandsUpCookiee = (data) => {
    const cookyer = data.cookyer  // 쿠커퍼블리셔와 쿠키섭스크라이버
    const cookiee = data.cookiee
    // 특정 쿠키를 찾아 리덕스에 저장된 리스트에서 해당 쿠키만 삭제하고
    const cookieeConnectionId = cookiee.stream.connection.connectionId
    const newHandsUpCookieeList = handsUpCookieeList.filter((item) => {
      return item !== cookieeConnectionId
    }) // 되는지 확인하고 파라미터로 넣어주던지, 넣었던걸 빼던지 하기
    dispatch(setHandsUpCookieeList(newHandsUpCookieeList))
    dispatch(setHandsUpCookiee(''))

    // 특정 쿠키에게만 시그널을 보내야 함
    cookyer.stream.session.signal({
      to: [cookiee.stream.connection],
      type: 'resetHandsUp'
    })
  }

  const handleModalClick = (e) => {
    e.stopPropagation()
  }

  const handleACookieeAudio = (data) => {
    const cookyer = data.cookyer
    const cookiee = data.cookiee
    
    cookyer.stream.session.signal({
      to: [cookiee.stream.connection],
      type: 'forceAudioAdjust'
    })
  }

  /** 소리 켠 참가자 리스트에 추가 */
  useEffect(() => {
    console.log('소리 켠 참가자 리스트에 추가', audioOnStream)
    if (audioOnStream !== undefined && audioOnStream !== '') {
      // 만약 손든 사람이 또 손들면 거르기
      if (audioOnList !== undefined && audioOnList !== []) {
        const newAudioOnList = audioOnList.filter((item) => {
          return item !== audioOnStream
        })
        newAudioOnList.push(audioOnStream)
        dispatch(setAudioOnList(newAudioOnList))
        console.log(newAudioOnList, "새 손들기 리스트")
      } else {
        dispatch(setAudioOnList([audioOnStream]))
        console.log(audioOnList, "손들기리스트에 값 없음")
      }
      dispatch(setAudioOnStream(''))
    }
  }, [audioOnStream])

  /** 소리 끈 참가자 리스트에서 제거 */
  useEffect(() => {
    console.log('손 내릴 쿠키 리스트에서 제거', audioOffStream)
    if (audioOnList !== undefined && audioOffStream !== '') {
      const newAudioOnList = audioOnList.filter((item) => {
        return item !== audioOffStream
      })
      dispatch(setAudioOnList(newAudioOnList))
      console.log(newAudioOnList, "손 내린 사람 제외 새 손들기 리스트")
      dispatch(setAudioOffStream(''))
    }
  }, [audioOffStream])

  return (
    <div className='video-page'>
      <div className='video-page-main'>
        {isSessionOpened ? null : (
          <LessonStepModal onClick={handleModalClick}/>
        )}
        <div className='video-content'>
          <VideoHeader/>
          <div className='cookyer-components'>
            <div className='cookyer-components-left'>
              <div className='cookyer-sharing'>
                <div className='cookyer-sharing-content'>
                  {shareScreenPublisher === null ? (
                    <UserVideoComponent
                      videoStyle='cookyer-sharing-content'
                      streamManager={publisher}
                    />
                  ) : (
                    <UserVideoComponent
                      videoStyle='cookyer-sharing-content'
                      streamManager={shareScreenPublisher}
                    />
                  )}
                </div>
              </div>
              <div className='cookyer-components-left-bottom'>
                <div className='cookyer'>
                  <UserVideoComponent
                    videoStyle='cookyer-video'
                    streamManager={publisher}
                  />
                </div>
                <Timer role='COOKYER'/>
              </div>
            </div>
            <div className='cookyer-cookiees'>
              {subscribers.map((sub, i) => (
                // <div key={sub.id} onClick={() => handleMainVideoStream(sub)}>
                <div key={i} className='cookyer-cookiee-content'>
                  <UserVideoComponent
                    videoStyle='cookyer-cookiee'
                    streamManager={sub}
                  />
                  {audioOnList && audioOnList.find((item) => item === sub.stream.connection.connectionId) ? (
                    <BsMicFill className='cookyer-cookiee-audio-icon-active' onClick={() => handleACookieeAudio({cookyer: publisher, cookiee: sub})}/>
                  ) : (
                    <BsMicMuteFill className='cookyer-cookiee-audio-icon' onClick={() => handleACookieeAudio({cookyer: publisher, cookiee: sub})}/>
                  )}
                  {checkCookieeList && checkCookieeList.find((item) => item === sub.stream.connection.connectionId) ? (
                    <AiFillCheckCircle className='cookyer-check-icon-active'/>
                  ) : (
                    <AiFillCheckCircle className='cookyer-check-icon'/>
                  )}
                  {handsUpCookieeList && handsUpCookieeList.find((item) => item === sub.stream.connection.connectionId) ? (
                    <IoIosHand
                      className={`cookyer-handsup-icon-active-${handsUpCookieeList.indexOf(sub.stream.connection.connectionId)}`}
                      onClick={() => resetHandsUpCookiee({cookyer: publisher, cookiee: sub})}
                    />
                  ) : (
                    <IoIosHand className='cookyer-handsup-icon'/>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <CookyerLessonStep/>
      </div>
      <CookyerVideoSideBar/>
    </div>
  );
}

export default CookyerScreen;
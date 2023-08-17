import React, { useEffect, useState } from 'react';
import VideoHeader from '../../component/Video/VideoHeader';
import UserVideoComponent from '../../component/Video/UserVideoComponent';
import Timer from '../../component/Video/Timer';
import CookieeLessonStep from '../../component/Video/Cookiee/CookieeLessonStep';
import CookieeVideoSideBar from '../../component/Video/Cookiee/CookieeVideoSideBar';
import OtherCookiees from '../../component/Video/Cookiee/OtherCookiees';
import LessonReviewModal from '../../component/Video/Cookiee/LessonReviewModal';

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { audioMute, deleteSubscriber, enteredSubscriber, leaveSession, setAudioMute, setAudioOffStream, setAudioOnList, setAudioOnStream, setMainStreamManager, setMainVideo } from '../../store/video/video';
import { joinSession } from '../../store/video/video-thunk';
import { initCookieeVideo, resetCheck, resetHandsUp } from '../../store/video/cookieeVideo';
import { setCurStep, setLessonInfo, setStepInfo } from '../../store/video/videoLessonInfo';
import { initScreenShare } from '../../store/video/screenShare';

import { AiFillCheckCircle } from 'react-icons/ai'
import { IoIosHand, IoIosTimer } from 'react-icons/io'
import { BsMicFill, BsMicMuteFill } from "react-icons/bs";
import '../../style/video/cookieeScreen.css'

function CookieeScreen() {
  const dispatch = useDispatch()
  
  const OV = useSelector((state) => state.video.OV)
  const session = useSelector((state) => state.video.session)
  const publisher = useSelector((state) => state.video.publisher)
  const subscribers = useSelector((state) => state.video.subscribers)

  const sessionId = useSelector((state) => state.video.sessionId)
  const nickname = localStorage.getItem('nickname');
  const role = localStorage.getItem('role')

  /** 레슨 정보 */
  const access_token = localStorage.getItem('access_token')
  const videoLessonId = useSelector((state) => state.video.videoLessonId)
  // const [ myLesson, setMyLesson ] = useState(undefined)  // 학생 모달창에 불러서 쓸 레슨 정보

  const [ isCompleted, setIsCompleted ] = useState(false)

  /** 체크 기능 */
  const check = useSelector((state) => state.cookieeVideo.check)
  const [ checkVisible, setCheckVisible ] = useState(false)

  /** 손들기 기능 */
  const handsUp = useSelector((state) => state.cookieeVideo.handsUp)
  const [ handsUpVisible, setHandsUpVisible ] = useState(false)

  /** 타이머 아이콘 보이기 */
  const timerCheck = useSelector((state) => state.timer.timerCheck)
  const [ timerVisible, setTimerVisible ] = useState(false)

  /** 선생님 화면 고정하기 위해 선생님 subscriber 찾기 */
  const [ cookyerStream, setCookyerStream ] = useState(undefined)
  
  /** 화면공유 subscriber 찾기 */
  const [ screenShareStream, setScreenShareStream ] = useState(undefined)
  // const shareScreenPublisher = useSelector((state) => state.screenShare.shareScreenPublisher)

  /** 참가자 소리 상태 확인 */
  const audioOnList = useSelector((state) => state.video.audioOnList)
  const audioOnStream = useSelector((state) => state.video.audioOnStream)
  const audioOffStream = useSelector((state) => state.video.audioOffStream)

  /** 다른 쿠키 목록 기능 */
  const showOthers = useSelector((state) => state.cookieeVideo.showOthers)

  /** 쿠커가 설정한 mainVideoStream */
  const mainVideo = useSelector((state) => state.video.mainVideo)

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
    if (subscribers) {
      console.log(subscribers)
      const cookyer = subscribers.find((sub) => (
        JSON.parse(sub.stream.connection.data).clientData.role === 'COOKYER'
      ))
      setCookyerStream(cookyer)
      const share = subscribers.find((sub) => (
        JSON.parse(sub.stream.connection.data).clientData.role === 'SHARE'
      ))
      if (share) {
        setScreenShareStream(share)
      }
      // 섭스크라이버에서 SHARE 찾기
    }
  }, [subscribers])

  useEffect(() => {
    console.log(3, session)
    if (session) {
      // On every new Stream received...
      const handleStreamCreated = (event) => {
        const subscriber = session.subscribe(event.stream, undefined);
        if (subscriber && subscriber.stream.audioActive) {
          dispatch(setAudioOnStream(subscriber.stream.connection.connectionId))
        }
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

      /** 쿠커가 수업을 종료하면 스토어에 저장된 관련 정보 초기화 후 리뷰쓰러 */
      session.on('sessionDisconnected', () => {
        // session.disconnect()  // 얘가 없어서 카메라가 계속 켜져있었나?
        dispatch(leaveSession())
        dispatch(initCookieeVideo())
        dispatch(initScreenShare())
        setIsCompleted(true)
        // 쿠커가 수업 종료와 함께 모든 쿠키들을 페이지 이동 시키려면 이곳에서 하면 됨
      })

      /** 쿠커로부터 체크 리셋 시그널 받고 체크 해제 */
      session.on('signal:resetCheck', () => {
        console.log("체크 리셋 시그널")
        dispatch(resetCheck())
      })

      /** 쿠커로부터 손들기 리셋 시그널 받고 손들기 해제 */
      // 쿠커가 특정 쿠키에게만 신호를 보내도록 설정해줘야 함!!!!
      session.on('signal:resetHandsUp', () => {
        console.log("손들기 리셋 시그널")
        dispatch(resetHandsUp())
      })

      /** 쿠커로부터 진행단계 변화 시그널 받고 진행단계 바꾸기 */
      session.on('signal:changeStep', (e) => {
        console.log("진행단계 시그널", e.data)
        const data = JSON.parse(e.data)
        console.log(data)
        if (data !== undefined) {
          dispatch(setStepInfo(data))
        }
      })

      /** 쿠커로부터 음소거 시그널 받고 음소거하기 */
      session.on('signal:forceAudioMute', () => {
        console.log("음소거 시그널")
        dispatch(setAudioMute())
      })

      /** 쿠커로부터 오디오 조정 시그널 받고 조정 */
      session.on('signal:forceAudioAdjust', () => {
        console.log("오디오 조정 시그널")
        dispatch(audioMute())
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

      /** 화면 공유 종료시 이벤트 추가 */
      session.on('signal:shareEnd', () => {
        setScreenShareStream(undefined)
      })

      /** 쿠커가 설정한 mainVideoStream 이벤트 추가 */
      session.on('signal:mainVideo', (e) => {
        const connectionId = JSON.parse(e.data).connectionId
        console.log(connectionId, "mainVideo 시그널 받음")
        dispatch(setMainVideo(connectionId))
      })

      console.log(4)

      /** 페이지 입장 후 세션에 연결 및 발행하기 */
      const data = {
        OV,
        session,
        sessionId,
        nickname,
        role
      }
      dispatch(joinSession(data))


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
          console.log('화상 과외 수업 정보 받아와짐', res.data)
          dispatch(setLessonInfo(res.data))
          const firstLessonStep = res.data.lessonStepList.find((step) => step.stepOrder === 1)
          console.log(firstLessonStep.stepContent)
          dispatch(setCurStep(firstLessonStep.stepContent))
        })
        .catch((err) => {
          console.log(err)
          console.log('화상 과외 수업 정보 안받아와짐')
        })
    }
  }, [videoLessonId])

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
        console.log(newAudioOnList, "새 소리 켠 참가자 리스트")
      } else {
        dispatch(setAudioOnList([audioOnStream]))
        console.log(audioOnList, "소리 켠 참가자 리스트에 값 없음")
      }
      dispatch(setAudioOnStream(''))
    }
  }, [audioOnStream])

  /** 소리 끈 참가자 리스트에서 제거 */
  useEffect(() => {
    console.log('소리 끈 참가자 리스트에서 제거', audioOffStream)
    if (audioOffStream !== undefined && audioOffStream !== '') {
      if (audioOnList !== undefined && audioOnList !== []) {
        const newAudioOnList = audioOnList.filter((item) => {
          return item !== audioOffStream
        })
        dispatch(setAudioOnList(newAudioOnList))
        console.log(newAudioOnList, "소리 끈 참가자 제외 새 손들기 리스트")
      }
      dispatch(setAudioOffStream(''))
    }
  }, [audioOffStream])

  useEffect(() => {
    if (mainVideo) {
      setScreenShareStream(mainVideo)
    }
  }, [mainVideo])

  useEffect(() => {
    if (check) {
      setCheckVisible(true)
    }
  }, [check])

  useEffect(() => {
    if (handsUp) {
      setHandsUpVisible(true)
    }
  }, [handsUp])

  useEffect(() => {
    if (checkVisible) {
      const timeoutId = setTimeout(() => {
        setCheckVisible(false);
      }, 2000);
  
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [checkVisible]);

  useEffect(() => {
    if (handsUpVisible) {
      const timeoutId = setTimeout(() => {
        setHandsUpVisible(false);
      }, 2000);
  
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [handsUpVisible]);

  useEffect(() => {
    if (timerCheck) {
      setTimerVisible(true)
    }
  }, [timerCheck])

  useEffect(() => {
    if (timerVisible) {
      const timeoutId = setTimeout(() => {
        setTimerVisible(false);
      }, 2000);
  
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [timerVisible]);

  return (
    <div className='video-page'>
      {isCompleted ? (
        <LessonReviewModal/>
      ) : null}
      {session ? (
        <div>
          <CookieeVideoSideBar/>
          <div>
            <div>
              <VideoHeader size={'full'}/>
              <div className='cookiee-video-content'>
                <div>
                  <div className='cookiee-sharing'>
                    <div className='cookiee-sharing-content'>
                      {isCompleted ? (
                        null
                      ) : (
                        screenShareStream ? (
                          <UserVideoComponent
                            videoStyle='cookiee-sharing-content'
                            streamManager={screenShareStream}
                          />
                        ) : (
                          <UserVideoComponent
                            videoStyle='cookiee-sharing-content'
                            streamManager={cookyerStream}
                          />
                        )
                      )}
                    </div>
                  </div>
                  <CookieeLessonStep size={'full'}/>
                </div>
                <div>
                  {/* 쿠커 화면 */}
                  <div className='cookiee-content'>
                    {cookyerStream ? (
                      <UserVideoComponent
                        videoStyle='cookiee-content-video'
                        streamManager={cookyerStream}
                      />
                    ) : (
                      null
                    )}
                    {cookyerStream && audioOnList && audioOnList.find((item) => item === cookyerStream.stream.connection.connectionId) ? (
                      <BsMicFill className='cookiee-cookyer-audio-icon-active'/>
                    ) : (
                      <BsMicMuteFill className='cookiee-cookyer-audio-icon'/>
                    )}
                  </div>
                  <Timer role='COOKIEE' size='full'/>
                  {/* 쿠키 본인 화면 */}
                  <div className='cookiee-content'>
                    {publisher !== undefined ? (
                      <UserVideoComponent
                        videoStyle='cookiee-content-video'
                        streamManager={publisher}
                        gesture={true}
                      />
                    ) : (
                      null
                    )}
                    {check ? (
                      <AiFillCheckCircle className='cookiee-check-icon-active'/>
                    ) : (
                      <AiFillCheckCircle className='cookiee-check-icon'/>
                    )}
                    {handsUp ? (
                      <IoIosHand className='cookiee-handsup-icon-active'/>
                    ) : (
                      <IoIosHand className='cookiee-handsup-icon'/>
                    )}
                    {checkVisible && <AiFillCheckCircle className='cookiee-check-animation'/>}
                    {handsUpVisible && <IoIosHand className='cookiee-handsup-animation'/>}
                    {timerVisible && <IoIosTimer className='cookiee-timer-animation'/>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>                
      ) : null}
      {showOthers ? (
        <OtherCookiees/>
      ) : null}
    </div>
  );
}

export default CookieeScreen;
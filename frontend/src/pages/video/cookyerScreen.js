import React, { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import CookyerFullScreen from "../../component/Video/Cookyer/CookyerFullScreen";
import CookyerHalfScreen from "../../component/Video/Cookyer/CookyerHalfScreen";

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSubscriber, enteredSubscriber, setAudioOffStream, setAudioOnList, setAudioOnStream, setMainStreamManager } from '../../store/video/video';
import { joinSession } from '../../store/video/video-thunk';
import { deleteCookiee, setCheckCookiee, setCheckCookieeList, setHandsDownCookiee, setHandsUpCookiee, setHandsUpCookieeList, setUncheckCookiee } from '../../store/video/cookyerVideo';
import { setLessonInfo } from '../../store/video/videoLessonInfo';
import '../../style/video.css'
import '../../style/video/common.css'
import '../../style/video/cookyerHalfScreen.css'
import '../../style/video/cookyerFullScreen.css'

function CookyerScreen() {
  /** 반응형 웹 관련 */
  const isFull = useMediaQuery({
    query: "(min-width: 1201px)"
  })
  const isHalf = useMediaQuery({
    query: "(max-width: 1200px"
  })

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

  /** 메인비디오스트림 설정 */
  const mainStreamManager = useSelector((state) => state.video.mainStreamManager)

  useEffect(() => {
    console.log(3, session)
    if (session) {
      // console.log("세션 바뀜")
      // On every new Stream received...
      const handleStreamCreated = (event) => {
        const subscriber = session.subscribe(event.stream, undefined);
        console.log("등장", subscriber)
        if (subscriber && subscriber.stream.audioActive) {
          dispatch(setAudioOnStream(subscriber.stream.connection.connectionId))
        }
        if (JSON.parse(subscriber.stream.connection.data).clientData.role === 'COOKIEE') {
          dispatch(enteredSubscriber(subscriber))
        }
      };

      // On every Stream destroyed...
      const handleStreamDestroyed = (event) => {
        console.log("나간 사람 제외", event)
        dispatch(deleteSubscriber(event.stream.streamManager))
        dispatch(deleteCookiee(event.stream.connection.connectionId))
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
        dispatch(setHandsUpCookieeList([handsUpCookiee]))
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

  const resetHandsUpCookiee = (e, data) => {
    e.stopPropagation()
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

  const handleACookieeAudio = (e, data) => {
    e.stopPropagation()
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
    console.log('소리 끈 참가자 리스트에서 제거', audioOffStream)
    if (audioOnList !== undefined && audioOffStream !== '') {
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

  /** 메인비디오스트림 지정 */
  const handleMainVideoStream = (stream) => {
    if (mainStreamManager !== stream) {
      dispatch(setMainStreamManager(stream))
      const data = {
        connectionId: stream.stream.connection.connectionId
      }
      publisher.stream.session.signal({
        data: JSON.stringify(data),
        type: 'mainVideo'
      })
    } else {
      if (shareScreenPublisher) {
        dispatch(setMainStreamManager(shareScreenPublisher))
        const data = {
          connectionId: shareScreenPublisher.stream.connection.connectionId
        }
        publisher.stream.session.signal({
          data: JSON.stringify(data),
          type: 'mainVideo'
        })
      } else {
        dispatch(setMainStreamManager(publisher))
        const data = {
          connectionId: publisher.stream.connection.connectionId
        }
        publisher.stream.session.signal({
          data: JSON.stringify(data),
          type: 'mainVideo'
        })
      }
    }
  }

  useEffect(() => {
    console.log(shareScreenPublisher, "화면공유 퍼블리셔 바뀜")
    if (shareScreenPublisher !== null) {
      dispatch(setMainStreamManager(shareScreenPublisher))
      const data = {
        connectionId: shareScreenPublisher.stream.connection.connectionId
      }
      publisher.stream.session.signal({
        data: JSON.stringify(data),
        type: 'mainVideo'
      })
    } else {
      if (publisher) {
        dispatch(setMainStreamManager(publisher))
        const data = {
          connectionId: publisher.stream.connection.connectionId
        }
        publisher.stream.session.signal({
          data: JSON.stringify(data),
          type: 'mainVideo'
        })
      }
    }
  }, [shareScreenPublisher])

  /** 이벤트 버블링 막기 */
  const noneClick = (e) => {
    e.stopPropagation()
  }

  return (
    <div className="video-background">
      {isFull && 
        <CookyerFullScreen
          session={session}
          publisher={publisher}
          mainStreamManager={mainStreamManager}
          subscribers={subscribers}
          audioOnList={audioOnList}
          checkCookieeList={checkCookieeList}
          handsUpCookieeList={handsUpCookieeList}
          isSessionOpened={isSessionOpened}
          handleModalClick={handleModalClick}
          handleMainVideoStream={handleMainVideoStream}
          handleACookieeAudio={handleACookieeAudio}
          resetHandsUpCookiee={resetHandsUpCookiee}
          noneClick={noneClick}
        />
      }
      {isHalf && 
        <CookyerHalfScreen
          session={session}
          publisher={publisher}
          mainStreamManager={mainStreamManager}
          subscribers={subscribers}
          audioOnList={audioOnList}
          checkCookieeList={checkCookieeList}
          handsUpCookieeList={handsUpCookieeList}
          isSessionOpened={isSessionOpened}
          shareScreenPublisher={shareScreenPublisher}
          handleModalClick={handleModalClick}
          handleMainVideoStream={handleMainVideoStream}
          handleACookieeAudio={handleACookieeAudio}
          resetHandsUpCookiee={resetHandsUpCookiee}
          noneClick={noneClick}
        />
      }
    </div>
  )
}

export default CookyerScreen
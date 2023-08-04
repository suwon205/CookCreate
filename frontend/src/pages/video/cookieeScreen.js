import React, { useEffect, useState } from 'react';
import VideoSideBar from '../../component/Video/VideoSideBar';
import VideoHeader from '../../component/Video/VideoHeader';
import UserVideoComponent from '../../component/Video/UserVideoComponent';
import Timer from '../../component/Video/Timer';
import LessonStepWidget from '../../component/Video/LessonStepWidget';

import '../../style/video.css'
import { useDispatch, useSelector } from 'react-redux';
import { deleteSubscriber, enteredSubscriber, leaveSession, setSubscribers } from '../../store/video/video';
import { joinSession, publishStream } from '../../store/video/video-thunk';
import { resetCheck, resetHandsUp, setIsCompleted } from '../../store/video/cookieeVideo';
import { useNavigate } from 'react-router-dom';

function CookieeScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const OV = useSelector((state) => state.video.OV)
  const session = useSelector((state) => state.video.session)
  const publisher = useSelector((state) => state.video.publisher)
  const subscribers = useSelector((state) => state.video.subscribers)
  // 항상 쿠커가 먼저 들어와있기 때문에 이 로직도 괜찮을 것 같지만, subscribers가 있을때만 실행되는 것으로 변경
  // const cookyerStream = subscribers.find((sub) => (
  //   JSON.parse(sub.stream.connection.data).clientData.role === 'cookyer'
  // ))

  const streamManager = useSelector((state) => state.screenShare.streamManager)

  const OvToken = useSelector((state) => state.video.OvToken)
  const sessionId = useSelector((state) => state.video.sessionId)
  const myUserName = localStorage.getItem('nickname');
  const role = localStorage.getItem('role')

  const isCompleted = useSelector((state) => state.cookieeVideo.isCompleted)

  /** 체크 기능 */
  const check = useSelector((state) => state.cookieeVideo.check)

  /** 손들기 기능 */
  const handsUp = useSelector((state) => state.cookieeVideo.handsUp)

  /** 선생님 화면 고정하기 위해 선생님 subscriber 찾기 */
  const [ cookyerStream, setCookyerStream ] = useState(undefined)

  useEffect(() => {
    if (subscribers) {
      console.log(subscribers)
      const cookyer = subscribers.find((sub) => (
        JSON.parse(sub.stream.connection.data).clientData.role === 'COOKYER'
      ))
      setCookyerStream(cookyer)
    }
  }, [subscribers, cookyerStream])

  useEffect(() => {
    console.log(3, session)
    if (session) {
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

      /** 쿠커가 수업을 종료하면 스토어에 저장된 관련 정보 초기화 후 리뷰쓰러 */
      // session.off('sessionDisconnected', () => {
      session.on('sessionDisconnected', () => {
        dispatch(leaveSession())  // 혹시나 리뷰에서 관련 정보 필요하면 리뷰 쓴 후에 초기화로 미루기
        dispatch(setIsCompleted())
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

      /** 화면공유 받기 */
      // session.on('signal:sharedScreen', (e) => {
      //   console.log("화면공유 데이터 받았다", e)  // 시그널 받는거 필요하지 않을수도?
      // })

      console.log(4)

      /** 페이지 입장 후 세션에 연결 및 발행하기 */
      const data = {
        OV,
        session,
        sessionId,
        myUserName,
        role
      }
      dispatch(joinSession(data))
      // dispatch(publishStream({data}))


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

  // const handleMainVideoStream = (stream) => {
  //   if (mainStreamManager !== stream) {
  //     dispatch(setMainStreamManager({publisher: stream}))
  //   }
  // }

  return (
    <div className='video-page'>
      <VideoSideBar/>
      <div>
        <VideoHeader/>
        <div>
          <div>
            <div className='cookiee-sharing'>
            {/* <div className='cookiee-sharing' onClick={() => handleMainVideoStream(cookyerStream)}> */}
              <div className='cookiee-sharing-content'>
                {isCompleted ? (
                  <p>수업이 종료되었습니다.</p>
                ) : (
                  <UserVideoComponent
                    videoStyle='cookiee-sharing-content'
                    streamManager={cookyerStream}
                  />
                )}
              </div>
            </div>
            <LessonStepWidget/>
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
                <h1>쿠커 화면</h1>
              )}
            </div>
            <Timer role='COOKIEE'/>
            {/* 쿠키 본인 화면 */}
            <div className='cookiee-content'>
              {publisher !== undefined ? (
                <UserVideoComponent
                  videoStyle='cookiee-content-video'
                  streamManager={publisher}
                />
              ) : (
                <h1>쿠키 화면</h1>
              )}
              {check ? (
                <h1>나 체크했다</h1>
              ) : null}
              {handsUp ? (
                <h1>나 손들었다</h1>
              ) : null}
            </div>

            {/* <div className='cookyer-cookiees'> */}
              {/* {subscribers} */}
              {/* {subscribers ? (
                subscribers.map((sub, i) => (
                  <div key={i}>
                    <UserVideoComponent
                      videoStyle='cookyer-cookiee'
                      streamManager={sub}
                    />
                  </div>
                ))
              ) : null} */}
            {/* </div> */}

          </div>
        </div>
      </div>
    </div>
  );
}

export default CookieeScreen;
import React, { useEffect, useState } from 'react';
import VideoSideBar from '../../component/Video/VideoSideBar';
import VideoHeader from '../../component/Video/VideoHeader';
import UserVideoComponent from '../../component/Video/UserVideoComponent';
import Timer from '../../component/Video/Timer';
import LessonStepWidget from '../../component/Video/LessonStepWidget';

import '../../style/video.css'
import { useDispatch, useSelector } from 'react-redux';
import { deleteSubscriber, enteredSubscriber, setSubscribers } from '../../store/video/video';
import { publishStream } from '../../store/video/video-thunk';
import { resetCheck } from '../../store/video/cookieeVideo';

function CookieeScreen() {
  const dispatch = useDispatch()
  
  const session = useSelector((state) => state.video.session)
  const publisher = useSelector((state) => state.video.publisher)
  const subscribers = useSelector((state) => state.video.subscribers)
  // const cookieeConnection = useSelector((state) => state.video.cookieeConnection)
  // 항상 쿠커가 먼저 들어와있기 때문에 이 로직도 괜찮을 것 같지만, subscribers가 있을때만 실행되는 것으로 변경
  // const cookyerStream = subscribers.find((sub) => (
  //   JSON.parse(sub.stream.connection.data).clientData.role === 'cookyer'
  // ))

  const streamManager = useSelector((state) => state.screenShare.streamManager)

  const OvToken = useSelector((state) => state.video.OvToken)
  const myUserName = localStorage.getItem('nickname');
  const role = localStorage.getItem('role')

  // /** 체크 기능 */
  // const check = useSelector((state) => state.cookieeVideo.check)

  /** 선생님 화면 고정하기 위해 선생님 subscriber 찾기 */
  const [ cookyerStream, setCookyerStream ] = useState(undefined)

  useEffect(() => {
    if (subscribers) {
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

      // /** 쿠커로부터 체크 리셋 시그널 받고 체크 해제 */
      // session.on('signal:resetCheck', () => {
      //   console.log("리셋시그널")
      //   dispatch(resetCheck())
      // })

      // /** 화면공유 받기 */
      // // 현재 시그널이 안받아지는 상태. 하지만 이전부터 문제이므로 일단은 신경X
      // // session.on('signal:sharedScreen', handleSharedScreen)
      // session.on('signal:sharedScreen', (e) => {
      //   console.log("화면공유 데이터 받았다", e)
      //   let remoteUsers = subscribers
      //   remoteUsers.forEach((user) => {
      //     if (user.getConnectionId() === e.from.connectionId) {
      //       console.log("화면공유 데이터 받았다", e.from)
      //       // const data = JSON.parse(e.data)
      //       // console.log("화면공유 시그널", e.data)
      //       // if (data.isAudioActive !== undefined) {
      //       //   user.setAudioActive(data.isAudioActive);
      //       // }
      //       // if (data.isVideoActive !== undefined) {
      //       //     user.setVideoActive(data.isVideoActive);
      //       // }
      //       // if (data.nickname !== undefined) {
      //       //     user.setNickname(data.nickname);
      //       // }
      //       // if (data.isScreenShareActive !== undefined) {
      //       //     user.setScreenShareActive(data.isScreenShareActive);
      //       // }
      //     }
      //   })
      //   dispatch(setSubscribers(subscribers))
      // })

      console.log(4)

      /** 페이지 입장 후 세션에 연결 및 발행하기 */
      const data = {
        token: OvToken,
        myUserName: myUserName
      }
      dispatch(publishStream({data}))


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
              <div className='cookiee-sharing-content'>
                <span>화면공유</span>
              </div>
            </div>
            {/* <div className='cookiee-sharing' onClick={() => handleMainVideoStream(publisher)}>
              <UserVideoComponent
                videoStyle='cookiee-sharing-content'
                streamManager={publisher}
              />
            </div> */}
            <div className='cookiee-sharing'>
              {streamManager !== null ? (
                <UserVideoComponent
                  videoStyle='cookiee-sharing-content'
                  streamManager={streamManager}
                />
              ) : (
                <UserVideoComponent
                  videoStyle='cookiee-sharing-content'
                  streamManager={publisher}
                />
              )}
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
              ) : null}
            </div>
            <Timer role={role}/>
            {/* 쿠키 본인 화면 */}
            <div className='cookiee-content'>
              <UserVideoComponent
                videoStyle='cookiee-content-video'
                streamManager={publisher}
              />
              {/* {check ? (
                <h1>나 체크했다</h1>
              ) : null} */}
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
import React, { useEffect } from 'react';
import VideoSideBar from '../../component/Video/VideoSideBar';
import VideoHeader from '../../component/Video/VideoHeader';
import UserVideoComponent from '../../component/Video/UserVideoComponent';
import Timer from '../../component/Video/Timer';
import LessonStepWidget from '../../component/Video/LessonStepWidget';

import '../../style/video.css'
import { useDispatch, useSelector } from 'react-redux';
import { deleteSubscriber, enteredSubscriber } from '../../store/video/video';
import { publishStream } from '../../store/video/video-thunk';

function CookyerScreen() {
  const dispatch = useDispatch()
  
  const session = useSelector((state) => state.video.session)
  const publisher = useSelector((state) => state.video.publisher)
  const subscribers = useSelector((state) => state.video.subscribers)

  /** 화면공유 */
  const streamManager = useSelector((state) => state.screenShare.streamManager)

  const OvToken = useSelector((state) => state.video.OvToken)
  const myUserName = localStorage.getItem('nickname');
  const role = localStorage.getItem('role')

  /** 체크 도전 */
  const checkCookieeList = useSelector((state) => state.cookyerVideo.checkCookieeList)

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

      console.log(4)
      const data = {
        token: OvToken,
        myUserName: myUserName
      }
      dispatch(publishStream(data))

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

  return (
    <div className='video-page'>
      <VideoSideBar/>
      <div>
        <VideoHeader/>
        <div>
          <div className='cookyer-sharing'>
            <div className='cookyer-sharing-content'>
              {streamManager === null ? (
                <span>화면공유</span>
              ) : (
                <UserVideoComponent
                  videoStyle='cookyer-sharing-content'
                  streamManager={streamManager}
                />
              )}
            </div>
          </div>
          {/* <div className='cookyer-sharing' onClick={() => handleMainVideoStream(publisher)}>
            <UserVideoComponent
              videoStyle='cookyer-sharing-content'
              streamManager={publisher}
            />
          </div> */}
          <div className='cookyer-cookiees'>
            {/* {subscribers} */}
            {subscribers.map((sub, i) => (
              <div key={i}>
                {/* <span>{sub.id}</span> */}
                <UserVideoComponent
                  videoStyle='cookyer-cookiee'
                  streamManager={sub}
                />
                {checkCookieeList && checkCookieeList.find((item) => item === sub.stream.connection.connectionId) ? (
                  <h1>손 든 사람</h1>
                ) : null}
              </div>
            ))}
          </div>
          <div className='cookyer'>
            <UserVideoComponent
              videoStyle='cookyer-video'
              streamManager={publisher}
            />
          </div>
          <Timer role={role}/>
          <LessonStepWidget/>
        </div>
      </div>
    </div>
  );
}

export default CookyerScreen;
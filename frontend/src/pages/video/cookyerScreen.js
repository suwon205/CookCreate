import React, { useEffect } from 'react';
import VideoSideBar from '../../component/Video/VideoSideBar';
import VideoHeader from '../../component/Video/VideoHeader';
import UserVideoComponent from '../../component/Video/UserVideoComponent';
import Timer from '../../component/Video/Timer';
import LessonStepWidget from '../../component/Video/LessonStepWidget';

import '../../style/video.css'
import { useDispatch, useSelector } from 'react-redux';
import { deleteSubscriber, enteredSubscriber } from '../../store/video/video';
import { joinSession, publishStream } from '../../store/video/video-thunk';
import { setCheckCookiee, setCheckCookieeList, setHandsUpCookiee, setHandsUpCookieeList } from '../../store/video/cookyerVideo';

function CookyerScreen() {
  const dispatch = useDispatch()
  
  const OV = useSelector((state) => state.video.OV)
  const session = useSelector((state) => state.video.session)
  const publisher = useSelector((state) => state.video.publisher)
  const subscribers = useSelector((state) => state.video.subscribers)

  /** 화면공유 */
  const shareScreenPublisher = useSelector((state) => state.screenShare.shareScreenPublisher)

  const OvToken = useSelector((state) => state.video.OvToken)
  const sessionId = useSelector((state) => state.video.sessionId)
  const myUserName = localStorage.getItem('nickname');
  const role = localStorage.getItem('role')

  /** 체크 */
  const checkCookieeList = useSelector((state) => state.cookyerVideo.checkCookieeList)
  const checkCookiee = useSelector((state) => state.cookyerVideo.checkCookiee)

  /** 손들기 */
  const handsUpCookieeList = useSelector((state) => state.cookyerVideo.handsUpCookieeList)
  const handsUpCookiee = useSelector((state) => state.cookyerVideo.handsUpCookiee)

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
        dispatch(setCheckCookiee({checkCookiee: connectionId}))
        // setCheckCookiee(connectionId)
      })

      /** 손들기 이벤트 추가 */
      session.on('signal:handsUp', (e) => {
        const connectionId = JSON.parse(e.data).connectionId
        console.log('손 든 사람', connectionId)
        dispatch(setHandsUpCookiee({handsUpCookiee: connectionId}))
      })

      console.log(4)
      const data = {
        OV,
        session,
        sessionId,
        myUserName,
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
        // const mySession = session;
        // if (mySession) {
        //   mySession.disconnect(); // 예시에서는 disconnect()로 대체하였으나, 이는 OpenVidu에 따라 다르게 적용될 수 있음
        // }
      };
    }
  }, []);

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
        dispatch(setCheckCookieeList({checkCookieeList: newCheckCookieeList}))
        console.log(newCheckCookieeList, "새 체크 리스트")
      } else {
        dispatch(setCheckCookieeList({checkCookieeList: [checkCookiee]}))
        console.log(checkCookieeList, "체크리스트에 값 없음")
      }
    }
  }, [checkCookiee])

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
        dispatch(setHandsUpCookieeList({handsUpCookieeList: newHandsUpCookieeList}))
        console.log(newHandsUpCookieeList, "새 손들기 리스트")
      } else {
        dispatch(setCheckCookieeList({handsUpCookieeList: [handsUpCookiee]}))
        console.log(handsUpCookieeList, "손들기리스트에 값 없음")
      }
    }
  }, [handsUpCookiee])

  const resetHandsUpCookiee = (data) => {
    const cookyer = data.cookyer  // 쿠커퍼블리셔와 쿠키섭스크라이버
    const cookiee = data.cookiee
    // 특정 쿠키를 찾아 리덕스에 저장된 리스트에서 해당 쿠키만 삭제하고
    const cookieeConnectionId = cookiee.stream.connection.connectionId
    const newHandsUpCookieeList = handsUpCookieeList.filter((item) => {
      return item !== cookieeConnectionId
    }) // 되는지 확인하고 파라미터로 넣어주던지, 넣었던걸 빼던지 하기
    dispatch(setHandsUpCookieeList({handsUpCookieeList: newHandsUpCookieeList}))
    dispatch(setHandsUpCookiee({handsUpCookiee: ''}))

    // 특정 쿠키에게만 시그널을 보내야 함
    cookyer.stream.session.signal({
      to: [cookiee.stream.connection],
      type: 'resetHandsUp'
    })
  }

  return (
    <div className='video-page'>
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
              <div key={i}>
                <UserVideoComponent
                  videoStyle='cookyer-cookiee'
                  streamManager={sub}
                />
                {checkCookieeList && checkCookieeList.find((item) => item === sub.stream.connection.connectionId) ? (
                  <h1>체크한 사람</h1>
                ) : null}
                {handsUpCookieeList && handsUpCookieeList.find((item) => item === sub.stream.connection.connectionId) ? (
                  <div>
                    <h1>
                      {handsUpCookieeList.indexOf(sub.stream.connection.connectionId) +  1}번째로 손 든 사람
                    </h1>
                    <button onClick={() => resetHandsUpCookiee({cookyer: publisher, cookiee: sub})}>손들기 해제</button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <LessonStepWidget/>
        </div>
      </div>
      <VideoSideBar/>
    </div>
  );
}

export default CookyerScreen;
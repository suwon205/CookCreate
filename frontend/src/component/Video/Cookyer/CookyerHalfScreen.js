import React, { useEffect, useState } from "react";
import VideoHeader from '../VideoHeader';
import UserVideoComponent from '../UserVideoComponent';
import Timer from '../Timer';
import CookyerLessonStep from './CookyerLessonStep';
import LessonStepModal from './LessonStepModal';

// import '../../../style/video.css'
// import '../../../style/video/cookyerScreen.css'

import { AiFillCheckCircle } from 'react-icons/ai'
import { IoIosHand } from 'react-icons/io'
import { BsMicFill, BsMicMuteFill } from "react-icons/bs";
import CookyerVideoSideBar from "./CookyerVideoSideBar";

function CookyerHalfScreen(props) {
  const session = props.session
  const publisher = props.publisher
  const mainStreamManager = props.mainStreamManager
  const subscribers = props.subscribers
  const audioOnList = props.audioOnList
  const checkCookieeList = props.checkCookieeList
  const handsUpCookieeList = props.handsUpCookieeList
  const isSessionOpened = props.isSessionOpened
  const shareScreenPublisher = props.shareScreenPublisher

  const handleModalClick = props.handleModalClick
  const handleMainVideoStream = props.handleMainVideoStream
  const handleACookieeAudio = props.handleACookieeAudio
  const resetHandsUpCookiee = props.resetHandsUpCookiee
  const noneClick = props.noneClick

  /** 본인화면, 타이머 위젯 */
  const [ meWidget, setMeWidget ] = useState(false)
  const [ timerWidget, setTimerWidget ] = useState(false)

  useEffect(() => {
    console.log(subscribers, "구독자들 있냐 없냐")
  }, [subscribers])
  
  return (
    <div className='half-video-page'>
      {/* <div className="half-video-step-widget-cookyer-container">

      </div> */}
      {isSessionOpened ? null : (
        <LessonStepModal onClick={handleModalClick}/>
      )}
      {session ? (
        <div>
          {timerWidget ? <div className="half-timer-widget"><Timer role='COOKYER' size='half'/></div> : null}

          <CookyerVideoSideBar size={'half'} setMeWidget={setMeWidget} setTimerWidget={setTimerWidget}/>
          
          <div className="half-video-page-main">
            {shareScreenPublisher === null ? (
              <VideoHeader size={'half'}/>
            ) : null}

            <div className='half-cookyer-container'>
              <div className='half-cookyer-sharing'>
                <div className='half-cookyer-sharing-content' onClick={() => handleMainVideoStream(mainStreamManager)}>
                  <UserVideoComponent
                    videoStyle='half-cookyer-sharing-content'
                    streamManager={mainStreamManager}
                  />
                </div>
                {meWidget ? (
                  <div className='half-me-widget' onClick={() => handleMainVideoStream(publisher)}>
                    <UserVideoComponent
                      videoStyle='half-cookyer-video'
                      streamManager={publisher}
                    />
                  </div>
                ) : null}
              </div>
            </div>
            
            <div className='half-cookyer-cookiees-container'>
              {Object.keys(subscribers).length ? (
                <div
                  className='half-cookyer-cookiees'>
                  {subscribers.map((sub, i) => (
                    <div key={i}
                      className='half-cookyer-cookiee-content'
                      onClick={() => handleMainVideoStream(sub)
                    }>
                      <UserVideoComponent
                        videoStyle={`
                          half-cookyer-cookiee
                          ${checkCookieeList && checkCookieeList.find((item) => item === sub.stream.connection.connectionId) ? 'cookyer-check-border' : ''}
                          ${handsUpCookieeList && handsUpCookieeList.find((item) => item === sub.stream.connection.connectionId) ? `cookyer-handsup-border-${handsUpCookieeList.indexOf(sub.stream.connection.connectionId)}` : ''}
                        `}
                        streamManager={sub}
                      />
                      {audioOnList && audioOnList.find((item) => item === sub.stream.connection.connectionId) ? (
                        <BsMicFill className='half-cookyer-cookiee-audio-icon-active' onClick={(e) => handleACookieeAudio(e, {cookyer: publisher, cookiee: sub})}/>
                      ) : (
                        <BsMicMuteFill className='half-cookyer-cookiee-audio-icon' onClick={(e) => handleACookieeAudio(e, {cookyer: publisher, cookiee: sub})}/>
                      )}
                      {checkCookieeList && checkCookieeList.find((item) => item === sub.stream.connection.connectionId) ? (
                        <AiFillCheckCircle onClick={(e) => noneClick(e)} className='half-cookyer-check-icon-active'/>
                      ) : (
                        <AiFillCheckCircle onClick={(e) => noneClick(e)} className='half-cookyer-check-icon'/>
                      )}
                      {handsUpCookieeList && handsUpCookieeList.find((item) => item === sub.stream.connection.connectionId) ? (
                        <IoIosHand
                          className={`half-cookyer-handsup-icon-active-${handsUpCookieeList.indexOf(sub.stream.connection.connectionId)}`}
                          onClick={(e) => resetHandsUpCookiee(e, {cookyer: publisher, cookiee: sub})}
                        />
                      ) : (
                        <IoIosHand onClick={(e) => noneClick(e)} className='half-cookyer-handsup-icon'/>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="half-cookyer-nocookiees">
                  <p>수업에 참가중인 쿠키가 없습니다.</p>
                  <img src="/cookiee.png" alt=""/>
                </div>
              )}
            </div>
            
            <CookyerLessonStep size='half'/>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default CookyerHalfScreen
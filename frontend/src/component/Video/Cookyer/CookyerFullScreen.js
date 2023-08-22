import React from 'react';
import VideoHeader from '../VideoHeader';
import UserVideoComponent from '../UserVideoComponent';
import Timer from '../Timer';
import CookyerLessonStep from './CookyerLessonStep';
import LessonStepModal from './LessonStepModal';
import CookyerVideoSideBar from './CookyerVideoSideBar';

import { AiFillCheckCircle } from 'react-icons/ai'
import { IoIosHand } from 'react-icons/io'
import { BsMicFill, BsMicMuteFill } from "react-icons/bs";

function CookyerFullScreen(props) {
  const session = props.session
  const publisher = props.publisher
  const mainStreamManager = props.mainStreamManager
  const subscribers = props.subscribers
  const audioOnList = props.audioOnList
  const checkCookieeList = props.checkCookieeList
  const handsUpCookieeList = props.handsUpCookieeList
  const isSessionOpened = props.isSessionOpened

  const handleModalClick = props.handleModalClick
  const handleMainVideoStream = props.handleMainVideoStream
  const handleACookieeAudio = props.handleACookieeAudio
  const resetHandsUpCookiee = props.resetHandsUpCookiee
  const noneClick = props.noneClick

  return (
    <div className='video-page'>
      {isSessionOpened ? (
        <div>
          <CookyerVideoSideBar size={'full'}/>
          
          <div className='video-page-main'>
            <div className='video-content'>
              <VideoHeader size={'full'}/>
              <div className='cookyer-components'>
                <div className='cookyer-components-left'>
                  <div className='cookyer-sharing'>
                    <div className='cookyer-sharing-content' onClick={() => handleMainVideoStream(mainStreamManager)}>
                      {mainStreamManager ? (
                        <UserVideoComponent
                          videoStyle='cookyer-sharing-content'
                          streamManager={mainStreamManager}
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className='cookyer-components-left-bottom'>
                    <div className='cookyer' onClick={() => handleMainVideoStream(publisher)}>
                      <UserVideoComponent
                        videoStyle='cookyer-video'
                        streamManager={publisher}
                      />
                    </div>
                    <Timer role='COOKYER' size='full'/>
                  </div>
                </div>

              <div className='full-cookyer-cookiees-container'>
                {Object.keys(subscribers).length ? (
                  <div className='cookyer-cookiees'>
                    {subscribers.map((sub, i) => (
                      // <div key={sub.id} onClick={() => handleMainVideoStream(sub)}>
                      <div key={i} className='cookyer-cookiee-content' onClick={() => handleMainVideoStream(sub)}>
                        <UserVideoComponent
                          videoStyle={`
                            cookyer-cookiee
                            ${checkCookieeList && checkCookieeList.find((item) => item === sub.stream.connection.connectionId) ? 'cookyer-check-border' : ''}
                            ${handsUpCookieeList && handsUpCookieeList.find((item) => item === sub.stream.connection.connectionId) ? `cookyer-handsup-border-${handsUpCookieeList.indexOf(sub.stream.connection.connectionId)}` : ''}
                          `}
                          streamManager={sub}
                        />
                        {audioOnList && audioOnList.find((item) => item === sub.stream.connection.connectionId) ? (
                          <BsMicFill className='cookyer-cookiee-audio-icon-active' onClick={(e) => handleACookieeAudio(e, {cookyer: publisher, cookiee: sub})}/>
                        ) : (
                          <BsMicMuteFill className='cookyer-cookiee-audio-icon' onClick={(e) => handleACookieeAudio(e, {cookyer: publisher, cookiee: sub})}/>
                        )}
                        {checkCookieeList && checkCookieeList.find((item) => item === sub.stream.connection.connectionId) ? (
                          <AiFillCheckCircle onClick={(e) => noneClick(e)} className='cookyer-check-icon-active'/>
                        ) : (
                          <AiFillCheckCircle onClick={(e) => noneClick(e)} className='cookyer-check-icon'/>
                        )}
                        {handsUpCookieeList && handsUpCookieeList.find((item) => item === sub.stream.connection.connectionId) ? (
                          <IoIosHand
                            className={`cookyer-handsup-icon-active-${handsUpCookieeList.indexOf(sub.stream.connection.connectionId)}`}
                            onClick={(e) => resetHandsUpCookiee(e, {cookyer: publisher, cookiee: sub})}
                          />
                        ) : (
                          <IoIosHand onClick={(e) => noneClick(e)} className='cookyer-handsup-icon'/>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="full-cookyer-nocookiees">
                    <p>과외에 참가중인 쿠키가 없습니다.</p>
                    <img src='/cookiee.png' alt=''/>
                  </div>
                )}
              </div>
              </div>
            </div>
            <CookyerLessonStep size={'full'}/>
          </div>
        </div>
      ) : (
        <LessonStepModal onClick={handleModalClick}/>
      )}
      
    </div>
  );
}

export default CookyerFullScreen;
import { OpenVidu } from 'openvidu-browser';
import React, { useState, useEffect } from 'react';
// import './App.css';
import UserVideoComponent from '../../component/Video/UserVideoComponent';
import { useSelector, useDispatch } from "react-redux";
import { videoMute, audioMute, initOVSession, leaveSession, setMySessionId, setMyUserName, setMainStreamManager, deleteSubscriber, enteredSubscriber } from '../../store/video/video'
import { joinSession, switchCamera } from '../../store/video/video-thunk';


function Room() {
  const dispatch = useDispatch()

  const OV = useSelector((state) => state.video.OV)
  const session = useSelector((state) => state.video.session)
  const publisher = useSelector((state) => state.video.publisher)
  const mainStreamManager = useSelector((state) => state.video.mainStreamManager)
  const mySessionId = useSelector((state) => state.video.mySessionId)
  const myUserName = useSelector((state) => state.video.myUserName)
  const subscribers = useSelector((state) => state.video.subscribers)
  const currentVideoDevice = useSelector((state) => state.video.currentVideoDevice)

  const setVideoMute = () => {
    dispatch(videoMute())
  }

  const setAudioMute = () => {
    dispatch(audioMute())
  }

  const [join, setJoin] = useState(false)

  useEffect(() => {
    // componentDidMount
    window.addEventListener('beforeunload', onbeforeunload);

    // componentWillUnmount
    return () => {
      window.removeEventListener('beforeunload', onbeforeunload);
    };
  }, []);

  const onbeforeunload = (e) => {
    leaveSession()
  }

  const handleChangeSessionId = (e) => {
    dispatch(setMySessionId({mySessionId: e.target.value}))
  }

  const handleChangeUserName = (e) => {
    dispatch(setMyUserName({myUserName: e.target.value}))
  }

  const handleMainVideoStream = (stream) => {
    if (mainStreamManager !== stream) {
      dispatch(setMainStreamManager({publisher: stream}))
    }
  }

  // --- 2) Init a session ---
  useEffect(() => {
    console.log(join)
    if (join) {
      const OV = new OpenVidu()
      const session = OV.initSession()
      dispatch(initOVSession({OV, session}))
      console.log("0")
    }
  }, [join]);

  // --- 3) Specify the actions when events take place in the session ---
  useEffect(() => {
    console.log(session, "session 생겼니?")
    if (session) {
      console.log("세션 바뀜")
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

      console.log("1")
      dispatch(joinSession({OV, session, mySessionId, myUserName}))

      console.log("12")

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
  }, [session]);

  const handleLeaveSession = () => {
    if (session) {
      session.disconnect()
      dispatch(leaveSession())
      setJoin(false)
    }
  }

  const handleJoin = (event) => {
    console.log("handleJoin")
    event.preventDefault()
    setJoin(true)
  }

  return (
    <div>
      {session === undefined ? (
        <div id="join">
            <div id="img-div">
                {/* <img src="resources/images/openvidu_grey_bg_transp_cropped.png" alt="OpenVidu logo" /> */}
            </div>
            <div id="join-dialog" className="jumbotron vertical-center">
                <h1> Join a video session </h1>
                <form className="form-group"
                  onSubmit={handleJoin}
                >
                    <p>
                        <label>Participant: </label>
                        <input
                            className="form-control"
                            type="text"
                            id="userName"
                            value={myUserName}
                            onChange={handleChangeUserName}
                            required
                        />
                    </p>
                    <p>
                        <label> Session: </label>
                        <input
                            className="form-control"
                            type="text"
                            id="sessionId"
                            value={mySessionId}
                            onChange={handleChangeSessionId}
                            required
                        />
                    </p>
                    <p className="text-center">
                        <input className="btn btn-lg btn-success" name="commit" type="submit" value="JOIN"/>
                    </p>
                </form>
              </div>
          </div>
      ) : null}

      {/* join 이후 화면 */}
      {session !== undefined ? (
        <div id="session">
            <div id="session-header">
                <h1 id="session-title">{mySessionId}</h1>
            </div>
            <div id="session-sidebar">
                <input
                    className="btn btn-large btn-danger"
                    type="button"
                    id="buttonLeaveSession"
                    onClick={handleLeaveSession}
                    value="Leave session"
                />
                <input
                    className="btn btn-large btn-success"
                    type="button"
                    id="buttonSwitchCamera"
                    onClick={() => dispatch(switchCamera({
                      OV, currentVideoDevice, session, mainStreamManager
                    }))}
                    value="Switch Camera"
                />
                <input
                    className="btn btn-large btn-success"
                    type="button"
                    id="buttonSwitchCamera"
                    onClick={setVideoMute}
                    value="Mute Video"
                />
                <input
                    className="btn btn-large btn-success"
                    type="button"
                    id="buttonSwitchCamera"
                    onClick={setAudioMute}
                    value="Mute Audio"
                />
            </div>

            {mainStreamManager !== undefined ? (
                <div id="main-video" className="col-md-6">
                    <UserVideoComponent streamManager={mainStreamManager} />

                </div>
            ) : null}
            <div id="video-container" className="col-md-6">
                {publisher !== undefined ? (
                    <div className="stream-container col-md-6 col-xs-6" onClick={() => handleMainVideoStream(publisher)}>
                        <UserVideoComponent
                            streamManager={publisher} />
                    </div>
                ) : (
                  <h1>Publisher 발행중</h1>
                )}
                {subscribers.map((sub, i) => (
                    <div key={sub.id} className="stream-container col-md-6 col-xs-6" onClick={() => handleMainVideoStream(sub)}>
                        <span>{sub.id}</span>
                        <UserVideoComponent streamManager={sub} />
                    </div>
                ))}
            </div>
        </div>
    ) : null}
    </div>
  )
}

export default Room;
import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios";
import { OpenVidu } from "openvidu-browser";

export const joinSession = createAsyncThunk(
  "video/joinSession",
  async (data) => {
    const OV = data.OV
    const session = data.session
    const sessionId = data.sessionId
    const myUserName = data.myUserName
    const role = data.role
    // let role = data.role
    // if (role === 'COOKYER') {
    //   role = 'MODERATOR'
    // }

    console.log("2")
    console.log(data, data.OV, data.session, data.sessionId, data.myUserName)
    try {
      console.log("3", sessionId)
      const token = await getToken({sessionId: sessionId});
      console.log("getToken 이후", token)

      if (myUserName && session) {
        console.log("8", token, myUserName)
        await session.connect(token, { clientData: { myUserName, role } });
        console.log("9")
        const publisher = await OV.initPublisherAsync(undefined, {
          audioSource: undefined, // The source of audio. If undefined default microphone
          videoSource: undefined, // The source of video. If undefined default webcam
          publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
          publishVideo: true, // Whether you want to start publishing with your video enabled or not
          resolution: '640x480', // The resolution of your video
          frameRate: 30, // The frame rate of your video
          insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
          mirror: false, // Whether to mirror your local video or not
        });

        // --- 6) Publish your stream ---
        console.log("10", publisher)
        await session.publish(publisher);

        // /** switchCamera 관련 추가 부분 */
        // // Obtain the current video device in use
        // var devices = await OV.getDevices();
        // var videoDevices = devices.filter(device => device.kind === 'videoinput');
        // var currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
        // var currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);

        // // Set the main video in the page to display our webcam and store our Publisher
        // const response = {
        //   currentVideoDevice: currentVideoDevice,
        //   publisher: publisher,
        // }
        // /** 여기까지 */

        // setCurrentVideoDevice(currentVideoDevice);
        console.log("11")
        console.log(publisher)
        return publisher
        // return publisher
      }
    } catch (error) {
      console.log('There was an error connecting to the session:', error.code, error.message);
    }
  }
)

async function getToken(mySessionId) {
  console.log("4", mySessionId)

  const newSessionId = await createSession(mySessionId.sessionId)
  console.log("5", newSessionId)

  const token = await createToken(newSessionId)

  console.log("7")
  console.log(token)
  return token
}

function createSession(sessionId) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = JSON.stringify({ 'customSessionId': sessionId })
      const response = await axios.post(
        `http://localhost:4443/openvidu/api/sessions`,
        data,
        {
          headers: {
            Authorization:
              'Basic ' + btoa('OPENVIDUAPP:MMT_SECRET'),
            'Content-Type': 'application/json',
          }
        },
      )
      setTimeout(() => {
        console.log('개발자 설정을 통한 강제 리턴')
        console.log(sessionId)
        return resolve(sessionId)
      }, 1000)
      console.log(response, "엥")
      return response.data
    } catch (response) {
      console.log(response)
      let error = Object.assign({}, response)
      if (error?.response?.status === 409) {
          return resolve(sessionId)
      }
    }
  })
}

function createToken(sessionId) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        `http://localhost:4443/openvidu/api/sessions/${sessionId}/connection`,
        {},
        {
          headers: {
            Authorization:
              'Basic ' + btoa('OPENVIDUAPP:MMT_SECRET'),
            'Content-Type': 'application/json',
          }
        },
      )
      console.log("6")
      console.log(response.data)
      return resolve(response.data.token)
    } catch (error) {
      return reject(error)
    }
  })
}

export const publishStream = createAsyncThunk(
  "video/publishStream",
  async (data) => {
    const OV = data.OV
    const session = data.session
    const token = data.token
    const myUserName = data.myUserName
    console.log("커넥트 전")
    await session.connect(token, { clientData: myUserName })
    console.log("커넥트 후")

    const publisher = await OV.initPublisherAsync(undefined, {
      audioSource: undefined, // The source of audio. If undefined default microphone
      videoSource: undefined, // The source of video. If undefined default webcam
      publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
      publishVideo: true, // Whether you want to start publishing with your video enabled or not
      resolution: '640x480', // The resolution of your video
      frameRate: 30, // The frame rate of your video
      insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
      mirror: false, // Whether to mirror your local video or not
    })

    console.log("쿠키/쿠커 퍼블리셔 만들어졌나?", publisher)
    await session.publish(publisher)

    const response = {
      OV, session, publisher
    }
    return response
  })

export const closeSession = createAsyncThunk(
  "video/closeSession",
  async (data) => {
    console.log("수업 끝 요청 보내기")
    const access_token = data.access_token
    const lessonId = data.lessonId

    console.log("레슨번호", lessonId)
    axios.delete(
      `/api/v1/session`,
      {
        data: {
          lessonId: lessonId
        },
        headers: {
          Access_Token: access_token
        }
      })
  }
)

export const shareScreen = createAsyncThunk(
  "screenShare/shareScreen",
  async (data) => {
    console.log("video-thunk/shareScreen")
    const shareScreenPublisher = await getShareScreenPublisher(data)
    console.log(shareScreenPublisher, "스크린퍼블리셔 만들어서 여기까지 옴")
    return shareScreenPublisher
  }
)

function getShareScreenPublisher(data) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("getShareScreenPublisher")
      const OV = data.OV
      const sharedPublisher = await OV.initPublisherAsync(
        undefined,
        {
          videoSource: 'screen',
          publishAudio: true,
          publishVideo: true,
          mirror: false,
          // resolution: '640x480', // The resolution of your video
          // frameRate: 30, // The frame rate of your video
          // insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
        },
        (error) => {
          if (error && error.name === 'SCREEN_EXTENSION_NOT_INSTALLED') {
            alert('screen extension not installed')
              // this.setState({ showExtensionDialog: true });
          } else if (error && error.name === 'SCREEN_SHARING_NOT_SUPPORTED') {
            alert('Your browser does not support screen sharing');
          } else if (error && error.name === 'SCREEN_EXTENSION_DISABLED') {
            alert('You need to enable screen sharing extension');
          } else if (error && error.name === 'SCREEN_CAPTURE_DENIED') {
            alert('You need to choose a window or application to share');
          }
        },
      )
      console.log("공유 화면 발행됐나?", sharedPublisher)
      return resolve(sharedPublisher)
    } catch (error) {
      return reject(error)
    }
  })
}
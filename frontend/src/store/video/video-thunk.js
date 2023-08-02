import { createAsyncThunk } from "@reduxjs/toolkit"
import { OpenVidu } from "openvidu-browser";

export const publishStream = createAsyncThunk(
  "video/publishStream",
  async (data) => {
    const token = data.token
    const myUserName = data.myUserName

    const OV = new OpenVidu()
    const session = OV.initSession()

    await session.connect(token, { clientData: myUserName })

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
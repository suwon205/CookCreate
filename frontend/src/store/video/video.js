import { createSlice } from '@reduxjs/toolkit'
import { closeSession, joinSession, publishStream } from './video-thunk'

const initialState = {
  OV: null,
  session: undefined,
  OvToken: undefined,
  sessionId: undefined,
  publisher: undefined,
  mainStreamManager: undefined,
  subscribers: [],
  isVideoPublished: true,
  isAudioPublished: true,
  videoLessonId: undefined,
  roomPresent: false,
  isSessionOpened: false,
}

export const video = createSlice({
  name: 'video',
  initialState,
  reducers: {
    initOVSession: (state, { payload }) => {
      state.OV = payload.OV
      state.session = payload.session
      console.log("initOVSession", state.OV, state.session)
    },
    setOvToken: (state, { payload }) => {
      console.log("리덕스 토큰 추가", payload.token)
      state.OvToken = payload.token
    },
    setSessionId: (state, { payload }) => {
      console.log("세션 아이디 저장 성공", payload)
      state.sessionId = payload.sessionId
    },
    setPublisher: (state, { payload }) => {
      console.log("13")
      state.publisher = payload.publisher
    },
    setMainStreamManager: (state, { payload }) => {
      state.mainStreamManager = payload.publisher
    },
    setSubscribers: (state, {payload}) => {
      state.subscribers = payload.subscribers
    },
    setVideoLessonId: (state, {payload}) => {
      state.videoLessonId = payload.videoLessonId
    },
    setRoomPresent: (state, {payload}) => {
      state.roomPresent = payload.roomPresent
    },
    setIsSessionOpened: (state, {payload}) => {
      state.isSessionOpened = payload.isSessionOpened
    },
    videoMute: (state) => {
      state.publisher.publishVideo(!state.isVideoPublished)
      state.isVideoPublished = !state.isVideoPublished
      console.log("비디오", state.isVideoPublished)
    },
    audioMute: (state) => {
      state.publisher.publishAudio(!state.isAudioPublished)
      state.isAudioPublished = !state.isAudioPublished
      console.log("오디오", state.isAudioPublished)
    },
    leaveSession: (state) => {
      // const mySession = state.session
      // if (mySession) {
      //   mySession.disconnect()
      // }
      state.OV = null
      state.session = undefined
      state.OvToken = undefined
      state.sessionId = undefined
      state.publisher = undefined
      state.mainStreamManager = undefined
      state.subscribers = []
      state.isVideoPublished = true
      state.isAudioPublished = true
      state.videoLessonId = undefined
      state.roomPresent = false
      state.isSessionOpened = false
    },
    enteredSubscriber: (state, action) => {
      state.subscribers.push(action.payload)
    },
    deleteSubscriber: (state, action) => {
      let index = state.subscribers.indexOf(action.payload, 0)
      if (index > -1) {
        state.subscribers.splice(index, 1)
      }
    }
  },
  extraReducers: {
    [joinSession.fulfilled]: (state, { payload }) => {
      console.log("joinSession fulfilled", payload)
      // state.currentVideoDevice = payload.currentVideoDevice
      // state.mainStreamManager = payload.publisher
      state.publisher = payload
      // console.log(state.publisher)
    },
    [joinSession.rejected]: (state, { payload }) => {
      console.log("joinSession rejected")
    },
    [publishStream.fulfilled]: (state, { payload }) => {
      console.log("publishStream fulfilled", payload)
      state.OV = payload.OV
      state.session = payload.session
      state.publisher = payload.publisher
    },
    [publishStream.rejected]: (state, { payload }) => {
      console.log("publishStream rejected")
    },
    [closeSession.fulfilled]: (state, { payload }) => {
      console.log("closeSession fulfilled", payload)
      state.OV = null
      state.session = undefined
      state.OvToken = undefined
      state.sessionId = undefined
      state.publisher = undefined
      state.mainStreamManager = undefined
      state.subscribers = []
      state.isVideoPublished = true
      state.isAudioPublished = true
      state.videoLessonId = undefined
      state.roomPresent = false
      state.isSessionOpened = false
    },
    [closeSession.rejected]: (state, { payload }) => {
      console.log("closeSession rejected")
    } 
  }
})

export const {
    initOVSession, setOvToken, setPublisher, setMainStreamManager, setSessionId,
    setSubscribers, setVideoLessonId, setRoomPresent, setIsSessionOpened,
    videoMute, audioMute, leaveSession,
    enteredSubscriber, deleteSubscriber,
} = video.actions
export default video.reducer
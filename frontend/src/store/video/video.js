import { createSlice } from '@reduxjs/toolkit'
import { closeSession, joinSession, publishStream } from './video-thunk'

const initialState = {
  OV: null,
  session: undefined,
  sessionId: undefined,
  publisher: undefined,
  mainStreamManager: undefined,
  subscribers: [],
  isVideoPublished: true,
  isAudioPublished: true,
  videoLessonId: undefined,
  isSessionOpened: false,  // 들어올때 이걸로 문제가 생기면 undefined로 바꾸기
  isExited: false,
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
    setSessionId: (state, { payload }) => {
      console.log("세션 아이디 저장 성공", payload)
      state.sessionId = payload
    },
    setPublisher: (state, { payload }) => {
      console.log("13")
      state.publisher = payload
    },
    setMainStreamManager: (state, { payload }) => {
      state.mainStreamManager = payload
    },
    setSubscribers: (state, {payload}) => {
      state.subscribers = payload
    },
    setVideoLessonId: (state, {payload}) => {
      state.videoLessonId = payload
    },
    setIsSessionOpened: (state, {payload}) => {
      state.isSessionOpened = payload
    },
    setIsExited: (state, {payload}) => {
      state.isExited = payload
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
    setAudioMute: (state) => {
      // 강제로 음소거할때
      console.log("강제 음소거 됐니")
      state.publisher.publishAudio(false)
      state.isAudioPublished = false
    },
    leaveSession: (state) => {
      state.OV = null
      state.session = undefined
      state.sessionId = undefined
      state.publisher = undefined
      state.mainStreamManager = undefined
      state.subscribers = []
      state.isVideoPublished = true
      state.isAudioPublished = true
      state.videoLessonId = undefined
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
    },
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
      // state.OV = null
      // state.session = undefined
      // state.sessionId = undefined
      // state.publisher = undefined
      // state.mainStreamManager = undefined
      // state.subscribers = []
      // state.isVideoPublished = true
      // state.isAudioPublished = true
      // state.videoLessonId = undefined
      state.isSessionOpened = false
    },
    [closeSession.rejected]: (state, { payload }) => {
      console.log("closeSession rejected")
    } 
  }
})

export const {
    initOVSession, setPublisher, setMainStreamManager, setSessionId,
    setSubscribers, setVideoLessonId, setIsSessionOpened, setIsExited,
    videoMute, audioMute, setAudioMute, leaveSession,
    enteredSubscriber, deleteSubscriber
} = video.actions
export default video.reducer
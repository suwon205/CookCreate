import { createSlice } from '@reduxjs/toolkit'
import { publishStream } from './video-thunk'

const initialState = {
  OV: null,
  session: undefined,
  OvToken: undefined,
  publisher: undefined,
  mainStreamManager: undefined,
  subscribers: [],
  isVideoPublished: true,
  isAudioPublished: true,
  videoLessonId: undefined,
  roomPresent: false,
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
      state.OvToken = payload.token
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
      const mySession = state.session
      if (mySession) {
        mySession.disconnect()
      }
      state.OV = null
      state.session = undefined
      state.OvToken = undefined
      state.publisher = undefined
      state.mainStreamManager = undefined
      state.subscribers = []
      state.isVideoPublished = true
      state.isAudioPublished = true
      state.videoLessonId = undefined
      state.roomPresent = false
    },
    enteredSubscriber: (state, action) => {
      // console.log("여기가 문제라고??", action.payload)
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
    [publishStream.fulfilled]: (state, { payload }) => {
      console.log("publishStream fulfilled", payload)
      state.OV = payload.OV
      state.session = payload.session
      state.publisher = payload.publisher
    },
    [publishStream.rejected]: (state, { payload }) => {
      console.log("publishStream rejected")
    }
  }
})

export const {
    initOVSession, setOvToken, setPublisher, setMainStreamManager,
    setSubscribers, setVideoLessonId, setRoomPresent,
    videoMute, audioMute, leaveSession,
    enteredSubscriber, deleteSubscriber,
} = video.actions
export default video.reducer
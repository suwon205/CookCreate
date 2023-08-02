import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  screenShareActive: false,
  streamManager: null,
}

export const screenShare = createSlice({
  name: 'screenShare',
  initialState,
  reducers: {
    setScreenShareActive: (state, { payload }) => {
      state.screenShareActive = payload.isScreenShareActive
    },
    setStreamManager: (state, { payload }) => {
      state.streamManager = payload.streamManager
    },
  },
})

export const {
  setScreenShareActive, setStreamManager
} = screenShare.actions
export default screenShare.reducer
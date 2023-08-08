import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  check: false,
  handsUp: false,
  showOthers: false
}

export const cookieeVideo = createSlice({
  name: 'cookieeVideo',
  initialState,
  reducers: {
    setCheck: (state) => {
      state.check = !state.check
    },
    resetCheck: (state) => {
      state.check = false
    },
    setHandsUp: (state) => {
      state.handsUp = !state.handsUp
    },
    resetHandsUp: (state) => {
      state.handsUp = false
    },
    setShowOthers: (state) => {
      state.showOthers = !state.showOthers
    },
    initCookieeVideo: (state) => {
      state.check = false
      state.handsUp = false
      state.showOthers = false
    },
  },
  extraReducers: {
  }
})

export const {
  setCheck, resetCheck, setHandsUp, resetHandsUp, setShowOthers, initCookieeVideo
} = cookieeVideo.actions
export default cookieeVideo.reducer
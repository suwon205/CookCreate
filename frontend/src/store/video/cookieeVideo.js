import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  check: false,
  handsUp: false,
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
    initCookieeVideo: (state) => {
      state.check = false
      state.handsUp = false
    }
  },
  extraReducers: {
  }
})

export const {
  setCheck, resetCheck, setHandsUp, resetHandsUp, initCookieeVideo
} = cookieeVideo.actions
export default cookieeVideo.reducer
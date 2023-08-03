import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  check: false,
  handsUp: false,
  isCompleted: false,
}

export const cookyerVideo = createSlice({
  name: 'cookyerVideo',
  initialState,
  reducers: {
    setCheck: (state) => {
      state.check = true
    },
    resetCheck: (state) => {
      state.check = false
    },
    setHandsUp: (state) => {
      state.handsUp = true
    },
    resetHandsUp: (state) => {
      state.handsUp = false
    },
    setIsCompleted: (state) => {
      state.isCompleted = true
    }
  },
  extraReducers: {
  }
})

export const {
  setCheck, resetCheck, setHandsUp, resetHandsUp, setIsCompleted
} = cookyerVideo.actions
export default cookyerVideo.reducer
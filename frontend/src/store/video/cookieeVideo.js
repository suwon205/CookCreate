import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  check: false,
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
    }
    
  },
  extraReducers: {
  }
})

export const {
  setCheck, resetCheck
} = cookyerVideo.actions
export default cookyerVideo.reducer
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  checkCookieeList: [],
  checkCookiee: '',
  handsUpCookieeList: [],
  handsUpCookiee: '',
}

export const cookyerVideo = createSlice({
  name: 'cookyerVideo',
  initialState,
  reducers: {
    setCheckCookieeList: (state, { payload }) => {
      state.checkCookieeList = payload.checkCookieeList
    },
    setCheckCookiee: (state, { payload }) => {
      state.checkCookiee = payload.checkCookiee
    },
    setHandsUpCookieeList: (state, { payload }) => {
      state.handsUpCookieeList = payload.handsUpCookieeList
    },
    setHandsUpCookiee: (state, { payload }) => {
      state.handsUpCookiee = payload.handsUpCookiee
    }
  },
  extraReducers: {
  }
})

export const {
  setCheckCookieeList, setCheckCookiee, setHandsUpCookieeList, setHandsUpCookiee
} = cookyerVideo.actions
export default cookyerVideo.reducer
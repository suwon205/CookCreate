import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  checkCookieeList: [],
  checkCookiee: '',
  uncheckCookiee: '',
  handsUpCookieeList: [],
  handsUpCookiee: '',
  handsDownCookiee: '',
}

export const cookyerVideo = createSlice({
  name: 'cookyerVideo',
  initialState,
  reducers: {
    setCheckCookieeList: (state, { payload }) => {
      state.checkCookieeList = payload
    },
    setCheckCookiee: (state, { payload }) => {
      state.checkCookiee = payload
    },
    setUncheckCookiee: (state, { payload }) => {
      state.uncheckCookiee = payload
    },
    setHandsUpCookieeList: (state, { payload }) => {
      state.handsUpCookieeList = payload
    },
    setHandsUpCookiee: (state, { payload }) => {
      state.handsUpCookiee = payload
    },
    setHandsDownCookiee: (state, { payload }) => {
      state.handsDownCookiee = payload
    },
    initCookyerVideo: (state) => {
      state.checkCookieeList = []
      state.checkCookiee = ''
      state.uncheckCookiee = ''
      state.handsUpCookieeList = []
      state.handsUpCookiee = ''
      state.handsDownCookiee = ''
    }
  },
  extraReducers: {
  }
})

export const {
  setCheckCookieeList, setCheckCookiee, setUncheckCookiee, setHandsUpCookieeList, setHandsUpCookiee, setHandsDownCookiee, initCookyerVideo
} = cookyerVideo.actions
export default cookyerVideo.reducer
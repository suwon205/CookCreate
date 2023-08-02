import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  checkCookieeList: [],
  checkCookiee: '',
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
    }
  },
  extraReducers: {
  }
})

export const {
  setCheckCookieeList, setCheckCookiee
} = cookyerVideo.actions
export default cookyerVideo.reducer
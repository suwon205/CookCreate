import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  checkCookieeList: [],
}

export const cookyerVideo = createSlice({
  name: 'cookyerVideo',
  initialState,
  reducers: {
    setCheckCookieeList: (state, { payload }) => {
      state.checkCookieeList = payload.checkCookieeList
    },
    
  },
  extraReducers: {
  }
})

export const {
  setCheckCookieeList
} = cookyerVideo.actions
export default cookyerVideo.reducer
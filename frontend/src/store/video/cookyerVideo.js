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
    },
    deleteCookiee: (state, { connectionId }) => {
      console.log("그냥 나간 쿠키 리스트에서 제거됐니")
      /** 손 든 참가자 리스트에서 제외 */
      if (state.handsUpCookieeList !== undefined) {
        const newHandsUpCookieeList = state.handsUpCookieeList.filter((item) => {
          return item !== connectionId
        })
        state.handsUpCookieeList = newHandsUpCookieeList
        console.log(newHandsUpCookieeList, "손 내린 사람 제외 새 손들기 리스트")
      }

      /** 체크한 참가자 리스트에서 제외 */
      if (state.checkCookieeList !== undefined) {
        const newCheckCookieeList = state.checkCookieeList.filter((item) => {
          return item !== state.uncheckCookiee
        })
        state.checkCookieeList = newCheckCookieeList
        console.log(newCheckCookieeList, '체크 해제한 사람 제외 새 체크 리스트')
      }
    }
  },
  extraReducers: {
  }
})

export const {
  setCheckCookieeList, setCheckCookiee, setUncheckCookiee, setHandsUpCookieeList, setHandsUpCookiee, setHandsDownCookiee, initCookyerVideo, deleteCookiee
} = cookyerVideo.actions
export default cookyerVideo.reducer
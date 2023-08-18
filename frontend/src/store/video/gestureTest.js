import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    timerTest: false,
    hand: false,
    check: false
}

export const gestureTest = createSlice({
    name: 'gestureTest',
    initialState,
    reducers: {
        startTimer: (state) => {
            state.timerTest = true;
        },
        raiseHand: (state) => {
            state.hand = true;
        },
        checkUp: (state) => {
            state.check = true;
        },
        resetAll: (state) => {
            return initialState;
        },
        initGesture: (state) => {
            state.timerTest = false
            state.hand = false
            state.check = false
        }
    },
    extraReducers: {

    }
})

export const { startTimer, raiseHand, checkUp, resetAll, initGesture } = gestureTest.actions
export default gestureTest.reducer
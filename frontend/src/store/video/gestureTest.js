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
        }
    },
    extraReducers: {

    }
})

export const { startTimer, raiseHand, checkUp, resetAll } = gestureTest.actions
export default gestureTest.reducer
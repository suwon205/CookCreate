import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    timerCheck: false // 그냥 바뀌기만 하면 되는 트리거용 변수
}

export const timer = createSlice({
    name: 'timer',
    initialState,
    reducers: {
        trigTimer: (state) => {
            state.timerCheck = !state.timerCheck
        },
    },
    extraReducers: {

    }
})

export const { trigTimer } = timer.actions
export default timer.reducer
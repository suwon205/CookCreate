
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isLogin: false,
    access_token: "",
    refresh_token : "",
    id : "",
    nickname: "",
    role : "",
    emoji : ""
}

export const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, { payload }) => {
            state.isLogin = true
            state.access_token = payload.access_token
            state.refresh_token = payload.refresh_token
            state.nickname = payload.nickname
            state.role = payload.role
            state.id = payload.userId
            if (payload.role === 'COOKYER') {
                state.emoji = "👩‍🍳"
            } else if (payload.role === 'COOKIEE') {
                state.emoji = "🍪"
            } else {
                state.emoji = ""
            }
            localStorage.setItem('nickname', payload.nickname)
            localStorage.setItem('role', payload.role)
            localStorage.setItem('id', payload.userId)
            localStorage.setItem('access_token', payload.access_token)
            localStorage.setItem('emoji', state.emoji)
            localStorage.setItem('refresh_token', payload.refresh_token)
        },
        logout: (state) => {
            state.isLogin = false
            state.access_token = ""
            state.refresh_token = ""
            state.nickname = ""
            state.role = ""
            state.emoji = ""

            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('nickname')
            localStorage.removeItem('role')
            localStorage.removeItem('id')
            localStorage.removeItem('emoji')
        },
    }
})

export const { login, logout } = auth.actions
export default auth.reducer
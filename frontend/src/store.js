import { configureStore } from '@reduxjs/toolkit'
import authReducer from './store/auth/auth'
import apiReducer from './store/apiUrl/apiUrl'
import lessonReducer from './store/lesson/lesson'
import accountSReducer from "./store/mypageS/accountS";
import lessonInfoReducer from './store/lessonInfo/lessonInfo'
import videoReducer from './store/video/video'
import screenShareReducer from './store/video/screenShare'
import cookyerVideoReducer from './store/video/cookyerVideo'
import cookieeVideoReducer from './store/video/cookieeVideo'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    api: apiReducer,
    lesson: lessonReducer,
    lessonInfo : lessonInfoReducer,
    accountS: accountSReducer,
    video: videoReducer,
    screenShare: screenShareReducer,
    cookyerVideo: cookyerVideoReducer,
    cookieeVideo: cookieeVideoReducer,
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
})
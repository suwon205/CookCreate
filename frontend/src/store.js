import { configureStore } from '@reduxjs/toolkit'
import authReducer from './store/auth/auth'
import apiReducer from './store/apiUrl/apiUrl'
import lessonReducer from './store/lesson/lesson'
import lessonInfoReducer from './store/lesson/lessonInfo'
import accountSReducer from "./store/mypageS/accountS";
import lessonSearchReducer from './store/lesson/lessonSearch'
import videoReducer from './store/video/video'
import screenShareReducer from './store/video/screenShare'
import cookyerVideoReducer from './store/video/cookyerVideo'
import cookieeVideoReducer from './store/video/cookieeVideo'
import videoLessonInfoReducer from './store/video/videoLessonInfo'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    api: apiReducer,
    lesson: lessonReducer,
    lessonSearch : lessonSearchReducer,
    lessonInfo : lessonInfoReducer,
    accountS: accountSReducer,
    video: videoReducer,
    screenShare: screenShareReducer,
    cookyerVideo: cookyerVideoReducer,
    cookieeVideo: cookieeVideoReducer,
    videoLessonInfo: videoLessonInfoReducer
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
})
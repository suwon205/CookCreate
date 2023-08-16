import { combineReducers, configureStore } from '@reduxjs/toolkit'
import storage from "redux-persist/lib/storage"
import { persistReducer, createTransform } from "redux-persist";

import authReducer from './store/auth/auth'
import apiReducer from './store/apiUrl/apiUrl'
import lessonReducer from './store/lesson/lesson'
import lessonInfoReducer from './store/lesson/lessonInfo'
import lessonEditReducer from './store/lesson/lessonEdit'
import accountSReducer from "./store/mypageS/accountS";
import lessonSearchReducer from './store/lesson/lessonSearch'
import videoReducer from './store/video/video'
import screenShareReducer from './store/video/screenShare'
import cookyerVideoReducer from './store/video/cookyerVideo'
import cookieeVideoReducer from './store/video/cookieeVideo'
import videoLessonInfoReducer from './store/video/videoLessonInfo'
import timerReducer from './store/video/timer'
import gestureTestReducer from './store/video/gestureTest'
import searchBarKeywordReducer from './store/lesson/searchBarKeyword';

/** redux-persist 설정 */
const reducers = combineReducers({
  auth: authReducer,
  api: apiReducer,
  lesson: lessonReducer,
  lessonSearch : lessonSearchReducer,
  lessonInfo : lessonInfoReducer,
  lessonEdit : lessonEditReducer,
  accountS: accountSReducer,
  video: videoReducer,
  screenShare: screenShareReducer,
  cookyerVideo: cookyerVideoReducer,
  cookieeVideo: cookieeVideoReducer,
  videoLessonInfo: videoLessonInfoReducer,
  timer: timerReducer,
  gestureTest : gestureTestReducer,
  searchBarKeyword : searchBarKeywordReducer
})

const setTransform = createTransform(
  (inboundState, key) => {
    return {...inboundState, mySet: [...inboundState.mySet]}
  },
  (outboundState, key) => {
    return {...outboundState, mySet: new Set(outboundState.mySet)}
  },
  { whitelist: ['video', 'screenShare'] }
)

const persistConfig = {
  key: 'root',
  storage,
  transforms: [setTransform],
  whitelist: [
    'auth', 'api', 'lesson', 'lessonSearch', 'lessonInfo', 'timer', 'searchBarKeyword',
    'accountS', 'cookyerVideo', 'cookieeVideo', 'videoLessonInfo'
  ],
  blacklist: []
}

const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
})

export default store
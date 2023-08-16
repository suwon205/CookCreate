import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cookyerId : '',
  categoryId : '',
  categoryName : '',
  cookyerName : '',
  description : '',
  difficulty : '',
  lessonTitle : '',
  jjimCount : '',
  lessonDate : '',
  lessonId : '',
  materials : '',
  maximum : 0,
  thumbnailUrl : '',
  lessonStepList : [],
  timeTaken : 0,
  price : 0,
  remaining : 0,
  videoUrl : '',
  introduce : '',
  food : [],
  badge : '',
  profileImg : ''
}

const lessonInfo = createSlice({
  name : 'lessonInfo',
  initialState,
  reducers : {
    setCookyerId : (state, action) => {
      state.cookyerId = action.payload
    },
    setCategoryId : (state, action) => {
      state.categoryId = action.payload
    },
    setFood : (state, action) => {
      state.food = action.payload
    },
    setCategoryName : (state, action) => {
      state.categoryName = action.payload
    },
    setCookyerName : (state, action) => {
      state.cookyerName = action.payload
    },
    setDescription : (state, action) => {
      state.description = action.payload
    },
    setDifficulty : (state, action) => {
      state.difficulty = action.payload
    },
    setJjimCount : (state, action) => {
      state.jjimCount = action.payload
    },
    setLessonDate : (state, action) => {
      state.lessonDate = action.payload
    },
    setLessonId : (state, action) => {
      state.lessonId = action.payload
    },
    setMaterials : (state, action) => {
      state.materials = action.payload
    },
    setMaximum : (state, action) => {
      state.maximum = action.payload
    },
    setThumbnailUrl : (state, action) => {
      state.thumbnailUrl = action.payload
    },
    setLessonStepList : (state, action) => {
      state.lessonStepList = action.payload
    },
    setTimeTaken : (state, action) => {
      state.timeTaken = action.payload
    },
    setLessonTitle : (state, action) => {
      state.lessonTitle = action.payload
    },
    setPrice : (state, action) => {
      state.price = action.payload
    },
    setRemaining : (state, action) => {
      state.remaining = action.payload
    },
    setVideoUrl : (state, action) => {
      state.videoUrl = action.payload
    },
    setIntroduce : (state, action) => {
      state.introduce = action.payload
    },
    setBadge : (state, action) => {
      state.badge = action.payload
    },
    setProfileImg : (state, action) => {
      state.profileImg = action.payload
    }
  }
})

export const {
  setCategoryId, setCategoryName,setCookyerId,
  setCookyerName, setDifficulty, setDescription, setLessonTitle,
  setJjimCount, setLessonDate, setLessonId, setBadge,
  setMaterials, setMaximum, setPrice, setRemaining, setThumbnailUrl,
  setLessonStepList, setTimeTaken, setVideoUrl, setIntroduce, setFood, setProfileImg
} = lessonInfo.actions
export default lessonInfo.reducer
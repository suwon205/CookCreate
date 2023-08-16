// lessonSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categoryId: '',
  categoryValid : false,
  lessonTitle: "",
  titleValid : false,
  maximum: 0,
  maxValid : false,
  price: "",
  priceValid : false,
  lessonDate: "",
  dateValid : false,
  difficulty: "",
  difficultyValid : false,
  timeTaken: 0,
  timeTakenValid : false,
  description: "",
  descriptionValid : false,
  materials: [],
  materialsValid : false,
  lessonStepList: [],
  stepValid : false,
  videoUrl: "",
  thumbnailValid: false
};

const lesson = createSlice({
  name: "lesson",
  initialState,
  reducers: {
    setLessonTitle: (state, action) => {
      state.lessonTitle = action.payload;
    },
    setTitleValid : (state, action) => {
      state.titleValid = action.payload
    },
    setCategory : (state, action) => {
      state.categoryId = action.payload
    },
    setCategoryValid : (state, action) => {
      state.categoryValid = action.payload
    },
    setTimeTaken : (state, action) => {
      state.timeTaken = action.payload
    },
    setTimeTakenVaild : (state, action) => {
      state.timeTakenValid = action.payload
    },
    setDateTime : (state, action) =>{
      state.lessonDate = action.payload
    },
    setDateValid : (state, action) => {
      state.dateValid = action.payload
    },
    setPrice : (state, action) =>{
      state.price = action.payload
    },
    setPriceValid : (state, action) => {
      state.priceValid = action.payload
    },
    setMaximum : (state, action) => {
      state.maximum = action.payload
    },
    setMaximumValid : (state, action) => {
      state.maxValid = action.payload
    },
    setDifficulty : (state, action) => {
      state.difficulty = action.payload
    },
    setDifficultyValid : (state, action) => {
      state.difficultyValid = action.payload
    },
    setDescription : (state, action) => {
      state.description = action.payload
    },
    setDescriptionValid : (state, action) => {
      state.descriptionValid = action.payload
    },
    setMaterials : (state, action) => {
      state.materials = action.payload
    },
    setMaterialsValid : (state, action) => {
      state.materialsValid = action.payload
    },
    setLessonStepList : (state, action) => {
      state.lessonStepList = action.payload
    },
    setStepValid : (state, action) => {
      state.stepValid = action.payload
    },
    setThumbnailVaild : (state, action) => {
      state.thumbnailValid = action.payload
    },
    setVideoUrl : (state, action) => {
      state.videoUrl = action.payload
    },
    resetlessonReducer : () => {
      return initialState
    }
  },
});

export const { 
  setLessonTitle, setTitleValid,
  setCategory, setCategoryValid,
  setTimeTaken, setTimeTakenVaild,
  setDateTime, setDateValid,
  setPrice, setPriceValid,
  setMaximum, setMaximumValid,
  setDifficulty, setDifficultyValid,
  setDescription, setDescriptionValid,
  setMaterials, setMaterialsValid,
  setLessonStepList, setStepValid,
  setVideoUrl, setThumbnailVaild, resetlessonReducer} = lesson.actions;
export default lesson.reducer;
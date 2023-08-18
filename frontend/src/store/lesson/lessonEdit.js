// lessonSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categoryId: "",
  categoryValid : true,
  lessonTitle: "",
  titleValid : true,
  maximum: 1,
  maxValid : true,
  price: 0,
  priceValid : true,
  lessonDate: "",
  dateValid : true,
  difficulty: "",
  difficultyValid : true,
  timeTaken: 60,
  timeTakenValid : true,
  description: "",
  descriptionValid : true,
  materials: [],
  materialsValid : true,
  lessonStepList: [{ stepOrder: 1, stepContent: "" }],
  stepValid : true,
  videoUrl: "",
  thumbnailUrl : '',

};

const lessonEdit = createSlice({
  name: "lessonEdit",
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
    setVideoUrl : (state, action) => {
      state.videoUrl = action.payload
    },
    setThumbnailUrl : (state, action) => {
      console.log('여기 오니?')
      state.thumbnailUrl = action.payload
    },
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
  setVideoUrl, setThumbnailUrl} = lessonEdit.actions;
export default lessonEdit.reducer;
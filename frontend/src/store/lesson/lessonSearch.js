import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  type : 'all',
  order : "title",
  deadline : true,
  category : [],
  keyword : "",
  lessonId : "",
  result : [],
}

const lessonSearch = createSlice({
  name : 'lessonSearch',
  initialState,
  reducers : {
    setOrder : (state, action) => {
      state.order = action.payload
    },
    setDeadLine : (state, action) => {
      state.deadline = action.payload
    },
    setCategories : (state, action) => {
      state.category = action.payload
    },
    setKeyword : (state, action) => {
      state.keyword = action.payload
    },
    setType : (state, action) => {
      state.type = action.payload
    },
    setLessonId : (state, action) => {
      state.lessonId = action.payload
    },
    setResult : (state, action) => {
      state.result = action.payload
    },
    setSearchBarKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    resetlessonSearch: (state) => {
      return {
        ...initialState,
        result: state.result, // result 필드는 유지
      };
    },
  }
})

export const {
  setOrder, setDeadLine, setCategories, setKeyword, setType,setResult, setLessonId,setSearchBarKeyword, resetlessonSearch
} = lessonSearch.actions
export default lessonSearch.reducer
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  type : 'all',
  order : "title",
  deadline : true,
  category : [],
  keyword : "",
  lessonId : ""
}
const searchBarKeyword = createSlice({
  name: 'searchBarKeyword',
  initialState,
  reducers: {
    setSearchBarKeyword: (state, action) => {
      state.keyword = action.payload;
      console.log(action)
    },
  },
});

export const { setSearchBarKeyword } = searchBarKeyword.actions; // 'actions' 속성으로 수정
export default searchBarKeyword.reducer; // 'reducer'로 수정
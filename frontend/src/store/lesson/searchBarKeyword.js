import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  keyword: "",
};

const searchBarKeyword = createSlice({
  name: 'searchBarKeyword',
  initialState,
  reducers: {
    setSearchBarKeyword: (state, action) => {
      state.keyword = action.payload;
    },
  },
});

export const { setSearchBarKeyword } = searchBarKeyword.actions; // 'actions' 속성으로 수정
export default searchBarKeyword.reducer; // 'reducer'로 수정
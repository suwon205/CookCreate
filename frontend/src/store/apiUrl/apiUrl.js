import { createSlice } from "@reduxjs/toolkit";

const apiUrl = createSlice({
  name : 'apiUrl',
  initialState : 'http://localhost:8080',
  reducers : {
    setApiUrl : (state, action) => {
      state  = action.payload
    }
  }
})

export const {setApiUrl} = apiUrl.actions
export default apiUrl.reducer
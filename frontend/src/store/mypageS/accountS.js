import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: "",
  nickname: "",
  food:[],
  role: "",
  profileImg: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  classData: null,
  completedData: null,
};

// export const mypages = createSlice({
//   name: "mypages",
//   initialState,
//   reducers: {
//     FetchUserInfo: (state, { payload }) => {
//       state.token = payload.token;
//       state.nickname = payload.nickname;
//       state.phoneNumber = payload.phoneNumber;
//       state.userEmail = payload.userEmail;
//       state.food = payload.food;
//       state.role = payload.role;
//       state.introduce = payload.introduce;
//       state.profileImg = payload.profileImg;
//       state.createDate = payload.createDate;
//       state.introUrl = payload.introUrl;
//     },
//   },
// });

const accountS = createSlice({
  name: "accountS",
  initialState,
  reducers: {
    updateUserS: (state, action) => {
      state.food = action.payload.food;
    },
    setClassData: (state, action) => {
      state.classData = action.payload
      console.log(action.payload, "수업데이터 저장")
    },
    setCompletedData: (state, action) => {
      state.completedData = action.payload
      console.log(action.payload, "완료된 수업 저장")
    }
  },
});

export const { updateUserS, setClassData, setCompletedData } = accountS.actions;
export default accountS.reducer;

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
// import { useSelector, useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
import FoodList from "../../component/SignUp/FoodList";
import SideBar from "./SideBar";

function Account() {
  // const accessToken = useSelector((state) => state.auth.access_token);
  const accessToken = localStorage.getItem('access_token')


  const [userData, setUserData] = useState({});
  const [food, setFood] = useState([]);

  // const [userIdDef, setUserId] = useState(userData.userId);
  const [nicknameDef, setNickName] = useState(userData.nickname);
  const [phoneNumberDef, setPhoneNumber] = useState(userData.phoneNumber);
  const [userEmailDef, setUserEmail] = useState(userData.userEmail);
  const [IntroduceDef, setIntroduce] = useState(userData.introduce);
  const [IntroUrlDef, setIntroUrl] = useState(userData.introUrl);
  // const defaultProfileImgUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  const [profileImgDef, setProfileImg] = useState(userData.profileImg  );
  const [profileImgUrl, setProfileImgUrl] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
  // const [profileImgDef, setProfileImg] = useState(userData.profileImg || defaultProfileImgUrl );
  const fileInput = useRef(null);

  //오류 메세지 저장
  // const [userIdMessage, setUserIdMessage] = useState("");
  // const [userIdDupMessage, setUserIdDupMessage] = useState("");
  const [userNicknameMessage, setUserNicknameMessage] = useState("");
  const [userNNDupMessage, setUserNNDupMessage] = useState("");
  const [userPhoneNumberMessage, setUserPhoneNumberMessage] = useState("");
  const [userEmailMessage, setUserEmailMessage] = useState("");
  const [userIntroduceMessage, setIntroduceMessage] = useState("");

  //유효성 검사
  // const [isUserId, setIsUserId] = useState(false);
  // const [isIdDupli, setIsIddup] = useState(false);
  const [isNickname, setIsNickname] = useState(false);
  const [isNicknameDupli, setIsNNdup] = useState(false);
  const [isPhoneNumber, setIsPhoneNumber] = useState(false);
  const [isUserEmail, setIsUserEmail] = useState(true);
  const [isIntroduce, setIsIntroduce] = useState(true);

  //중복 체크 로직
  // const idDupliCheck = () => {
  //   axios
  //     .get(`api/v1/auth/checkId/${userIdDef}`)
  //     .then((res) => {
  //       setUserIdDupMessage(res.data.message);
  //       setIsIddup(true);
  //     })
  //     .catch((err) => {
  //       setUserIdDupMessage(err.response.data.message);
  //       setIsIddup(false);
  //     });
  // };
  const nicknameDupliCheck = () => {
    axios
      .get(`api/v1/auth/checkNick/${nicknameDef}`)
      .then((res) => {
        setUserNNDupMessage(res.data.message);
        setIsNNdup(true);
      })
      .catch((err) => {
        setUserNNDupMessage(err.response.data.message);
        setIsNNdup(false);
      });
  };

  //유효성 검사 구현
  const onChangeIntroduce = async (e) => {
    const value = e.target.value;
    await setIntroduce(value);
    if (value.length > 100) {
      setIntroduceMessage("100자 이하로 입력해주세요");
      setIsIntroduce(false);
    } else {
      setIntroduceMessage("적합합니다! 🤗");
      setIsIntroduce(true);
    }
  };


  const onChangeUserNickName = async (e) => {
    const value = e.target.value;
    await setNickName(value);
    if (value.length < 2 || value.length > 8) {
      setUserNicknameMessage("2글자 이상 8글자 이하로 입력해주세요");
      setIsNickname(false);
    } else {
      setUserNicknameMessage("적합한 닉네임 형식입니다! 🤗");
      setIsNickname(true);
    }
  };
  const onChangeUserPhonenumber = async (e) => {
    const value = e.target.value;
    await setPhoneNumber(value);
    const phoneRegex = /^(01[016789]{1})[0-9]{3,4}[0-9]{4}$/;
    if (phoneRegex.test(value)) {
      setIsPhoneNumber(true);
      setUserPhoneNumberMessage("올바른 전화번호 형식입니다!");
    } else {
      setIsPhoneNumber(false);
      setUserPhoneNumberMessage("올바르지 않은 전화번호 형식입니다.");
    }
  };

  const onChangeUserEmail = async (e) => {
    const value = e.target.value;
    const emailRegex = /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    await setUserEmail(value);
    if (value === "") {
      setIsUserEmail(true);
      setUserEmailMessage("");
    } else if (emailRegex.test(value)) {
      setIsUserEmail(true);
      setUserEmailMessage("올바른 이메일 형식입니다!");
    } else {
      setIsUserEmail(false);
      setUserEmailMessage("올바른 이메일 형식을 입력하세요");
    }
  };


    //introUrl
    const onChangeintroUrl = async (e) => {
      const value = e.target.value;
      await setIntroUrl(value);
    };

  //회원정보조회
  useEffect(() => {
    axios
      .get(`api/v1/member`, {
        headers: {
          Access_Token: accessToken,
        },
      })
      .then((res) => {
        setUserData(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log("회원정보조회못함");
      });
  }, [accessToken]);



  useEffect(() => {
    if (userData.food) {
      setFood(userData.food);
      console.log("setFood", userData.food);
    }
  }, [userData]);




  //프로필

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImgUrl(reader.result);
        setProfileImg(file)
      };
      reader.readAsDataURL(file);
    }
  };



  // 프로필 이미지 변경
// const handleFileChange = (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     setProfileImg(file); 
//   }
// };



  //프로필 삭제
  const handleProfile = (e) => {
    if (profileImgDef) {

      axios
        .get(`api/v1/my/profile`, {
          headers: {
            Access_Token: accessToken,
          },
        })
        .then((res) => {
          setProfileImgUrl("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
          console.log(res.data);
        })
        .catch((err) => {
          console.log("프로필삭제못함",err);
        });
    
    }

  };

  //음식추가 제거
  const handleSelectedFood = (selectedFood) => {
    if (food) {
      if (food.includes(selectedFood)) {
        console.log("선택 전", food, selectedFood);
        const newFoodList = food.filter((item) => item !== selectedFood);
        console.log(newFoodList);
        setFood(newFoodList);
      } else {
        console.log("선택한 음식", [...food, selectedFood]);
        setFood([...food, selectedFood]);
      }
      console.log(food);
    } else {
      console.log("food 없음");
    }
  };

  //회원정보 수정
  const handleUpdate = (e) => {
    e.preventDefault();


    const formData = new FormData();
    formData.append("nickname", nicknameDef);
    console.log("폼데이터닉네임", typeof formData.get("nickname"));
    formData.append("phoneNumber", phoneNumberDef);
    console.log("폼데이터폰", typeof formData.get("phoneNumber"));
    formData.append("userEmail", userEmailDef);
    console.log("폼데이터이메일", typeof formData.get("phoneNumber"));

    formData.append("food", food);
    console.log("폼데이터푸드", formData.get("food"));
    console.log("폼데이터푸드", typeof formData.get("food"));

    formData.append("introduce", IntroduceDef);
    formData.append("profileImg", profileImgDef);
    formData.append("introUrl", IntroUrlDef);
    console.log("폼데이터소개", formData.get("introduce"));
    console.log("폼데이터이미지", formData.get("profileImg"));
    console.log("폼데이터이미지타입",  typeof formData.get("profileImg"));

    axios
      .put(`api/v1/member`, formData, {
        headers: {
          Access_Token: accessToken,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        alert("회원정보수정이 완료됐습니다.");
      })
      .catch((err) => {});
  };

  return (
    <div className="mypage">
      <SideBar />
      <div className="mytitle">정보수정</div>
      <div>가입일:{userData.createdDate}</div>
      <div className="myrole">{userData.role}</div>
      <div className="mysubtitle">프로필 변경</div>
      <img
        src={profileImgUrl}
        alt="Profile"
        style={{ margin: "20px", width: "200px", height: "200px", objectFit: "cover" }}
        onClick={() => {
          fileInput.current.click();
        }}
      />

      {/* <input type="file" onChange={(e) => profileImgDef(e.target.files[0])}  ref={fileInput} required /> */}
      <input type="file" style={{ display: "none" }} accept="image/jpg,image/png,image/jpeg" name="profile_img" onChange={handleFileChange} ref={fileInput} />
      <button onClick={handleProfile}>기본 프로필로 변경</button>

      <div className="myinputTitle">닉네임</div>
      <div className="inputWrap">
        <input placeholder={nicknameDef} type="text" value={nicknameDef} onChange={onChangeUserNickName} />
        <button onClick={nicknameDupliCheck}>중복확인</button>
        <div>
          {userNicknameMessage}
          {userNNDupMessage}
        </div>
      </div>


      <div className="myinputTitle">자기소개</div>
      <div>
        <textarea placeholder={IntroduceDef} value={IntroduceDef} onChange={onChangeIntroduce}></textarea>
        <div>{userIntroduceMessage}</div>
      </div>

      <div>
        <p>소개영상url</p>
        <input placeholder={IntroUrlDef} type="text" value={IntroUrlDef} onChange={onChangeintroUrl} />
      </div>

      <div className="myinputTitle">휴대폰번호</div>
      <div>
        <input type="text" placeholder={phoneNumberDef} value={phoneNumberDef} onChange={onChangeUserPhonenumber} />
        <div>{userPhoneNumberMessage}</div>
      </div>

      <div className="myinputTitle">이메일</div>
      <div>
        <input placeholder={userEmailDef} type="text" value={userEmailDef} onChange={onChangeUserEmail} />
        <div>{userEmailMessage}</div>
      </div>

      <div className="food">
        {/* <div>관심있는 요리</div>
        <div>{userData.food}</div> */}

        <FoodList selectedFood={food} toggleFood={handleSelectedFood} />
      </div>

      <div>
        <button
          onClick={handleUpdate}
          className="bottomBtn"
          disabled={!( isNickname && isNicknameDupli && isPhoneNumber && isUserEmail && isIntroduce)}
        >
          정보수정
        </button>
      </div>
    </div>
  );
}

export default Account;

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
// import { useSelector, useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import FoodList from "../../component/SignUp/FoodList";
import SideBar from "./SideBar";
import "./../../style/mypage/account.css";
import "./../../style/mypage/mypage.css";
import AlertModal from "../Modal/AlertModal";
function Account() {
  const accessToken = localStorage.getItem("access_token");

  const [userData, setUserData] = useState({});
  const [food, setFood] = useState([]);

  const [nicknameDef, setNickName] = useState("");
  const [phoneNumberDef, setPhoneNumber] = useState("");
  const [userEmailDef, setUserEmail] = useState("");
  const [IntroduceDef, setIntroduce] = useState("");
  // const defaultProfileImgUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  // const [profileImgDef, setProfileImg] = useState(userData.profileImg || defaultProfileImgUrl);

  const [previewImage, setPreviewImage] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  );
  const [profileImgDef, setProfileImg] = useState(userData.profileImg);

  const fileInput = useRef(null);

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
        setNickName(res.data.nickname);
        setPhoneNumber(res.data.phoneNumber);
        setUserEmail(res.data.userEmail);
        setIntroduce(res.data.introduce);
      })
      .catch((err) => {
        console.log("회원정보조회못함", err);
      });

    const storedPreviewImage = localStorage.getItem("previewImage");
    if (storedPreviewImage) {
      setPreviewImage(storedPreviewImage);
    }
  }, [accessToken]);

  //오류 메세지 저장
  // const [userIdMessage, setUserIdMessage] = useState("");
  // const [userIdDupMessage, setUserIdDupMessage] = useState("");
  const [userNicknameMessage, setUserNicknameMessage] = useState("");
  const [userNNDupMessage, setUserNNDupMessage] = useState("");
  const [userPhoneNumberMessage, setUserPhoneNumberMessage] = useState("");
  const [userEmailMessage, setUserEmailMessage] = useState("");
  const [userIntroduceMessage, setIntroduceMessage] = useState("");

  //유효성 검사
  const [isNickname, setIsNickname] = useState(true);
  const [isNicknameDupli, setIsNNdup] = useState(true);
  const [isPhoneNumber, setIsPhoneNumber] = useState(true);
  const [isUserEmail, setIsUserEmail] = useState(true);
  const [isIntroduce, setIsIntroduce] = useState(true);

  const [modalOpen, setModalOpen] = useState(false) 
  const handleModalClose = () => {
    setModalOpen(false)
  }
  //닉네임 중복검사
  const nicknameDupliCheck = () => {
    axios
      .get(`api/v1/auth/checkNick/${nicknameDef}`)
      .then((res) => {
        setUserNicknameMessage(res.data.message);
        setIsNNdup(true);
      })
      .catch((err) => {
        setUserNicknameMessage(err.response.data.message);
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
    setUserNNDupMessage("");
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
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
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

  useEffect(() => {
    if (userData.food) {
      setFood(userData.food);
      console.log("setFood", userData.food);
    }
  }, [userData]);

  //프로필 이미지 변경
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setProfileImg(file);

        localStorage.setItem("previewImage", reader.result);
      };
      reader.readAsDataURL(file);
      // setProfileImg(file)
    }
  };

  //기본 프로필로 변경
  // const handleProfile = (e) => {
  //   setProfileImg("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");

  // };

  //프로필 삭제
  const handleProfile = (e) => {
    e.preventDefault();

    axios
      .delete(`api/v1/my/profile`, {
        headers: {
          Access_Token: accessToken,
        },
      })
      .then((res) => {
        console.log("프로필삭제성공", res.data);
        setPreviewImage(
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        );
      })
      .catch((err) => {
        console.log("프로필삭제못함", err);
      });
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
    console.log("폼데이터닉네임", formData.get("nickname"));
    formData.append("phoneNumber", phoneNumberDef);
    console.log("폼데이터폰", formData.get("phoneNumber"));
    formData.append("userEmail", userEmailDef);
    console.log("폼데이터이메일", formData.get("userEmail"));

    formData.append("food", food);
    console.log("폼데이터푸드", formData.get("food"));
    console.log("폼데이터푸드", typeof formData.get("food"));

    formData.append("introduce", IntroduceDef);
    formData.append("profileImg", profileImgDef);
    console.log("폼데이터소개", formData.get("introduce"));
    console.log("폼데이터이미지", formData.get("profileImg"));
    console.log("폼데이터이미지", typeof formData.get("profileImg"));

    axios
      .put(`api/v1/member`, formData, {
        headers: {
          Access_Token: accessToken,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        setModalOpen(true)
        window.scrollTo({ top: 0, behavior: "smooth" });

      })
      .catch((err) => {});
  };

  return (
    <div className="account-container">
      <div className="account">
        <SideBar />
        <div className="mypage-title">정보수정</div>
        <div className="mypage-container">
          <div className="subtitle">프로필 이미지</div>
          <div className="mypage-profile">
            <img
              className="mypage-profile-image"
              src={previewImage}
              alt="Profile"
              style={{
                margin: "20px",
                marginTop: "10px",
                width: "150px",
                height: "150px",
                objectFit: "cover",
              }}
            />
            <div className="mypage-profile-sidecontent">
              <div className="joindate">
                가입일:{" "}
                {new Date(userData.createdDate).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="mypage-profile-buttongroup">
                <button
                  className="button orange"
                  onClick={() => fileInput.current.click()}
                >
                  변경
                </button>
                <button className="button" onClick={handleProfile}>
                  기본 프로필로 변경
                </button>
              </div>
            </div>
            <input
              type="file"
              style={{ display: "none" }}
              accept="image/jpg,image/png,image/jpeg"
              name="profile_img"
              onChange={handleFileChange}
              ref={fileInput}
            />
          </div>
          <div className="mypage-nickname">
            <div className="subtitle">닉네임</div>
            <div className="inputWrap">
              <input
                placeholder={userData.nickname}
                type="text"
                value={nicknameDef}
                onChange={onChangeUserNickName}
              />
              <button className="button" onClick={nicknameDupliCheck}>
                중복확인
              </button>
            </div>
            <div className="validation">
              {userNicknameMessage}
              {userNNDupMessage}
            </div>
          </div>

          <div className="mypage-introduce">
            <div className="subtitle">자기소개</div>
            <div className="mypage-introduce-container">
              <textarea
                placeholder={userData.introduce}
                value={IntroduceDef}
                onChange={onChangeIntroduce}
              ></textarea>
              <div className="validation">{userIntroduceMessage}</div>
            </div>
          </div>

          <div className="mypage-phonenumber">
            <div className="subtitle">휴대폰번호</div>
            <div>
              <input
                type="text"
                placeholder={userData.phoneNumber}
                value={phoneNumberDef}
                onChange={onChangeUserPhonenumber}
              />
              <div>{userPhoneNumberMessage}</div>
            </div>
          </div>

          <div className="mypage-email">
            <div className="subtitle">이메일</div>
            <div>
              <input
                placeholder={userData.userEmail}
                type="text"
                value={userEmailDef}
                onChange={onChangeUserEmail}
              />
              <div>{userEmailMessage}</div>
            </div>
          </div>

          <div className="mypage-foodcategory">
            <div className="subtitle">관심있는 요리</div>
            <FoodList selectedFood={food} toggleFood={handleSelectedFood} />
          </div>

          <div></div>
        </div>
        <div class="bottomBtn-container">
          <button
            onClick={handleUpdate}
            className="bottomBtn"
            disabled={
              !(
                isNickname &&
                isNicknameDupli &&
                isPhoneNumber &&
                isUserEmail &&
                isIntroduce
              )
            }
          >
            정보수정
          </button>
        </div>
      {modalOpen && (
        <AlertModal
          content={'회원 정보가 성공적으로 이루어졌습니다.'}
          path={null}
          actions={handleModalClose}
          data={null}
        />
      )}
      </div>
    </div>
  );
}

export default Account;

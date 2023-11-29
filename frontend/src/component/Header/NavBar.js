import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useDispatch, useSelector } from "react-redux";
import "../../style/navbar.css";
import AppliedLessonMenu from "./AppliedLessonMenu";
import UserDropMenu from "./UserDropMenu";
import axios from "axios";
import { RiArrowDropDownLine } from "react-icons/ri";
import { resetlessonSearch } from "../../store/lesson/lessonSearch";
import { setSearchBarKeyword } from "../../store/lesson/searchBarKeyword";
import { setClassData } from "../../store/mypageS/accountS";
function NavBar() {
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.auth.isLogin);

  const access_token = localStorage.getItem("access_token");
  const nickname = localStorage.getItem("nickname");
  const role = localStorage.getItem("role");
  const emoji = localStorage.getItem("emoji");

  /** 신청 수업 드롭다운 */
  const [lessonDropdown, setLessonDropdown] = useState(false);
  // const [myLessons, setMyLessons] = useState(undefined); // 학생 모달창에 불러서 쓸 레슨 정보
  const classData = useSelector((state) => (state.accountS.classData))

  /** 유저 드롭다운 */
  const [userDropdown, setUserDropdown] = useState(false);

  /** 쿠키 신청 메뉴 드롭다운 */
  const dropLessonMenu = () => {
    console.log(!lessonDropdown);
    setLessonDropdown((prev) => !prev);
  };

  /** 유저 메뉴 드롭다운 */
  const dropUserMenu = (data) => {
    console.log(!userDropdown);
    setUserDropdown(data);
    // setUserDropdown((prev) => !prev)
  };

  const location = useLocation();
  const mainPageStyle = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const navbarMain = document.querySelector(".navbar-main");

      if (location.pathname === "/" && scrollY > 1) {
        navbarMain.classList.add("scroll");
      } else {
        navbarMain.classList.remove("scroll");
      }
    };

    if (location.pathname === "/") {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location]);

  useEffect(() => {
    // 레슨 정보 받아오는 부분  // 누를때마다 요청되므로 나중에 스토어에 저장하던지 위치 바꿔주기
    if (access_token && role === "COOKIEE") {
      axios
        .get(`api/v1/my/applied`, {
          headers: {
            Access_Token: access_token,
          },
        })
        .then((res) => {
          console.log(res.data);
          console.log("신청한 수업 목록 받아와짐");
          if (
            typeof res.data === "object" &&
            res.data[0].message !== "신청한 과외가 없습니다."
          ) {
            dispatch(setClassData(res.data))
          // setMyLessons(res.data);
          } else {
            dispatch(setClassData(undefined))
          // setMyLessons(undefined);
          }
        })
        .catch((err) => {
          console.log(err);
          console.log("신청한 수업 목록 안받아와짐");
        });
    }
  }, [access_token, role]);

  const gotoLogin = () => {
    navigator("/login");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const gotoSignUp = () => {
    navigator("/signupbefore");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleLogo = () => {
    navigator("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const gotoTotalLesson = () => {
    navigator("/lesson");
    dispatch(resetlessonSearch());
    dispatch(setSearchBarKeyword(""));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleChatting = () => {
    navigator("/chatroom");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRegisterLesson = () => {
    navigator("/registerlesson");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="nav-wrap">
      <div className={`navbar ${mainPageStyle ? "navbar-main" : ""}`}>
        <div className="leftNav">
          <span
            onClick={handleLogo}
            style={{ marginRight: "32px", marginTop: "5px" }}
          >
            <img src="/logo.png" alt="로고" className="logo" />
          </span>
          <div onClick={gotoTotalLesson}>전체 과외</div>
          <SearchBar />
        </div>
        {isLogin ? (
          <div className="rightNav">
            <div onClick={handleChatting} className="nav-lesson">채팅</div>
            <div className="nav-lesson">
              {role === "COOKYER" ? (
                <div onClick={handleRegisterLesson}>과외 등록</div>
              ) : null}
              {role === "COOKIEE" ? (
                <div className="dropdown">
                  <button
                    role="link"
                    className="drop-btn"
                    onClick={dropLessonMenu}
                  >
                    신청과외
                  </button>
                  <RiArrowDropDownLine className="dropdown-icon" />
                  {lessonDropdown ? (
                    <div
                      onMouseLeave={() => dropLessonMenu(false)}
                      className="drop-wrap"
                    >
                      <AppliedLessonMenu myLessons={classData} />
                      {/* <AppliedLessonMenu myLessons={myLessons} /> */}
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div onClick={() => dropUserMenu(true)} className="nav-user">
                {emoji}
                {nickname}님
                <RiArrowDropDownLine className="dropdown-icon" />
                {userDropdown ? (
                  <div
                    onMouseLeave={() => dropUserMenu(false)}
                    className="drop-wrap"
                  >
                    <UserDropMenu />
                  </div>
                ) : null}
                {/* 쿠커들에게만 보입니다. */}
              </div>
            </div>
          </div>
        ) : (
          <React.Fragment>
            <div style={{ display: "flex" }}>
              <div
                className="nav-sign"
                onClick={gotoLogin}
                style={{ marginRight: "10px" }}
              >
                로그인
              </div>
              <div
                className="nav-sign"
                onClick={gotoSignUp}
                style={{ marginLeft: "10px" }}
              >
                회원가입
              </div>
            </div>
          </React.Fragment>
        )}
        {/* {role === 'COOKYER' ? <button onClick={() => createRoom(5)}>쿠커화면</button> : null} */}
      </div>
    </div>
  );
}

export default NavBar;

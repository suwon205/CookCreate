import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import ReviewForm from "./ReviewForm";
import Modal from 'react-modal';
import SideBar from "./SideBar";
import { useNavigate } from "react-router-dom";
import { initOVSession, setSessionId, setVideoLessonId } from "../../store/video/video";
import { OpenVidu } from "openvidu-browser";
import { setClassData, setCompletedData } from "../../store/mypageS/accountS";
import { setLessonId } from "../../store/lesson/lessonInfo";
import "./../../style/mypage/mypage.css";
import '../../style/classlist.css'

function ClassList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const accessToken = useSelector((state) => state.auth.access_token);
  console.log("토큰",accessToken);
  const classData = useSelector((state) => state.accountS.classData)
  const completedData = useSelector((state) => state.accountS.completedData)
  // const [classData, setClassData] = useState([]);
  // const [completedData, setCompletedData] = useState([]);
  const [ reviewLessonData, setReviewLessonData ] = useState(null);
  // const [showCompletedLectures, setShowCompletedLectures] = useState(false);

  /** 쿠커 화상과외방 입장 */
  const sessionId = useSelector((state) => state.video.sessionId)
  const session = useSelector((state) => state.video.session)
  const videoLessonId = useSelector((state) => state.video.videoLessonId)

  /** 이동할 과외 아이디 */
  const [ goLessonDetail, setGoLessonDetail ] = useState(false)
  const lessonId = useSelector((state) => state.lessonInfo.lessonId)

  useEffect(() => {
    axios
      .get(`api/v1/my/applied`, {
        headers: {
          Access_Token: accessToken,
        },
      })
      .then((res) => {
        console.log("신청한 과외", res.data);
        if (res.data[0].message !== "신청한 과외가 없습니다.") {
          dispatch(setClassData(res.data))
        } else {
          dispatch(setClassData(null))
        }
        // setClassData(res.data);
      })
      .catch((err) => {
        console.log("신청한 과외 조회 에러", err);
        // 에러 처리 로직 추가 가능
      });
  
    axios
      .get(`api/v1/my/completed`, {
        headers: {
          Access_Token: accessToken,
        },
      })
      .then((res) => {
        console.log("완료한 과외", res.data);
        if (res.data[0].message !== "신청한 과외가 없습니다.") {
          dispatch(setCompletedData(res.data))
        } else {
          dispatch(setCompletedData(null))
        }
        // setCompletedData(res.data);
      })
      .catch((err) => {
        console.log("완료한 과외 조회 에러", err);
        // 에러 처리 로직 추가 가능
      });
  }, []);

  // const handleSelectChange = (e) => {
  //   const selectedValue = e.target.value;
  //   if (selectedValue === "completed" ) {
  //     setShowCompletedLectures(true);
  //   } else {
  //     setShowCompletedLectures(false);
  //   }
  // };

  //모달

  const handleOpenModal = (data) => {
    setIsModalOpen(true);
    setReviewLessonData(data)
  };

  const handleCloseModal = (e) => {
    e.preventDefault()
    setIsModalOpen(false);
  };

  useEffect(() => {
    Modal.setAppElement("#root"); 
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  //리뷰폼 소통
  const [rating, setRating] = useState(1);
  // const [contents, setContents] = useState('');

  const handleClickRating = (value) => {
    setRating(value);
    console.log("classlist 핸들클릭", rating)
  };

  // handleReviewSubmit = (contents, ratingValue) => {
  //   setContents(contents);
  //   setRating(ratingValue);
  //   setIsModalOpen(false);
  // }

  /** 쿠키 화상과외 참여 */
  const joinLesson = (lessonId) => {
    console.log("쿠키 입장 요청", lessonId)
    dispatch(setVideoLessonId(lessonId))
  }

  // 1. 레슨아이디가 잘 저장되면 선생님이 해당 수업 방 만들기 요청 보내기
  useEffect(() => {
    if (videoLessonId !== undefined) {
      console.log(videoLessonId, "레슨번호", accessToken, "토큰")
      // 레슨아이디가 등록되면 학생은 토큰 생성 요청
      console.log("쿠키 세션아이디 요청")
      axios.post(
        `api/v1/session/create`,
        { 'lessonId': videoLessonId },
        {
          headers : {
            Access_Token : accessToken
          }
        })
        .then((res) => {
          console.log('쿠키 세션아이디 생성 성공', res.data)
          const sessionId = res.data.token
          dispatch(setSessionId(sessionId))
        })
        .catch((err) => {
          console.log('쿠키 세션아이디 생성 실패', err)
        })  
    } else {
      console.log("레슨아이디 없음")
    }
  }, [videoLessonId])

  // 2. 세션아이디가 생기면 이동. OV, session 객체 생성
  useEffect(() => {
    if (sessionId) {
      const newOV = new OpenVidu()
      const newSession = newOV.initSession()
      dispatch(initOVSession({OV: newOV, session: newSession}))
    }
  }, [sessionId])

  useEffect(() => {
    if (session) {
      if (sessionId) {
        navigate(`/videoLesson/COOKIEE`)
        window.scrollTo({ top: 0, behavior: 'smooth' });

      } else {
        console.log("쿠키 세션아이디 없어서 입장 불가")
      }
    }
  }, [session])

  const goLesson = (lessonId) => {
    setGoLessonDetail(true)
    dispatch(setLessonId(lessonId))
    navigate(`/lesson/${lessonId}`)
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }

  useEffect(() => {
    if (goLessonDetail && lessonId !== null) {
      navigate(`/lesson/${lessonId}`)
      window.scrollTo({ top: 0, behavior: 'smooth' });

    }
  }, [lessonId])

  return (
    <div className="container classlist">
      <SideBar />
      {isModalOpen ? (
        <div>
          <ReviewForm onClose={handleCloseModal} rating={rating} onClickRating={handleClickRating} reviewLessonData={reviewLessonData} />
        </div>
      ) : null}
          <div className="title">과외목록</div>
            <div>
              <div className="subtitle">신청한 과외</div>
              {classData !== null && classData !== undefined && classData ? (
                classData.map((lesson)=> (
                <div key={lesson.lessonId} className="classlist-list">
                  <img
                    loading="lazy"
                    src={lesson.thumbnailUrl}
                    className="swiper-lazy"
                    alt="course_title.png"
                  />
                  <div className="describe">
                    <div className="row class_title">
                      <div className="col1">과외명</div>
                      <div className="col2" onClick={() => goLesson(lesson.lessonId)}>{lesson.lessonTitle}</div>
                    </div>
                    <div className="row class_category">
                    <div className="col1">카테고리</div>
                      <div className="col2">
                        {(() => {
                          switch (lesson.categoryId) {
                            case 1:
                              return "한식";
                            case 2:
                              return "양식";
                            case 3:
                              return "중식";
                            case 4:
                              return "일식";
                            case 5:
                              return "아시안";
                            case 6:
                              return "건강식";
                            case 7:
                              return "디저트";
                            default:
                              return "알 수 없음";
                          }
                        })()}
                      </div>
                    </div>
                    <div className="row class_cookyer">
                      <div className="col1">쿠커</div>
                      <div className="col2">{lesson.cookyerName}</div>
                    </div>
                    <div className="row class_date">
                      <div className="col1">과외 날짜</div>
                      <div className="col2">
                        {new Date(lesson.lessonDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', hour: '2-digit', minute: '2-digit' })} 예정
                      </div>
                    </div>
                  </div>
                    {lesson.sessionId === null ? (
                      <button className="button" disabled="disabled">과외예정</button>
                    ) : (
                      <button className="button orange" onClick={() => joinLesson(lesson.lessonId)}>참가하기</button>
                    )}
                </div>
              ))
            ) : (
              <p>신청한 과외가 없습니다.</p>
            )}
          </div>

          <div>
            <div className="subtitle">완료한 과외</div>
            {completedData !== null && completedData !== undefined && completedData ? (
              completedData.map((lesson)=> (
                <div key={lesson.lessonId}>
                  <img
                    loading="lazy"
                    src={lesson.thumbnailUrl}
                    className="swiper-lazy"
                    alt="course_title.png"
                  />
                  <div>
                    <div className="course_title" onClick={() => goLesson(lesson.lessonId)}>과외명: {lesson.lessonTitle}</div>
                    <div className="course_title">
                    <div>카테고리</div>
                      <div>
                        {(() => {
                          switch (lesson.categoryId) {
                            case 0:
                              return "한식";
                            case 1:
                              return "양식";
                            case 2:
                              return "중식";
                            case 3:
                              return "일식";
                            case 4:
                              return "아시안";
                            case 5:
                              return "건강식";
                            case 6:
                              return "디저트";
                            default:
                              return "알 수 없음";
                          }
                        })()}
                      </div>
                    </div>
                    <div className="instructor">쿠커: {lesson.cookyerName}({lesson.cookyerId})</div>
                    <div>
                      <div className="info_delivery">
                        <div>
                          <img src="https://recipe1.ezmember.co.kr/img/mobile/icon_calendar.png" alt="기간아이콘" width="29" />
                          "과외 날짜"
                        </div>
                        <div>{new Date(lesson.lessonDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', hour: '2-digit', minute: '2-digit' })} 예정</div>
                      </div>
                    </div>
                    <div className="rating">
                      <div className="rating_star">
                        <div className="star_solid" style={{ width: "98.26086956521738%" }}>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleOpenModal(lesson)}>리뷰작성</button>
                </div>
              ))
            ) : (
              <p>완료한 과외가 없습니다.</p>
            )}
          </div>
    </div>
  );
}

export default ClassList;


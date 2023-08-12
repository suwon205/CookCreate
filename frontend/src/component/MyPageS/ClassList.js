import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import ReviewForm from "./ReviewForm";
import Modal from 'react-modal';
import '../../style/classlist.css'
import SideBar from "./SideBar";
import { useNavigate } from "react-router-dom";
import { initOVSession, setSessionId, setVideoLessonId } from "../../store/video/video";
import { OpenVidu } from "openvidu-browser";
import { setClassData, setCompletedData } from "../../store/mypageS/accountS";
import { setLessonId } from "../../store/lesson/lessonInfo";

function ClassList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const accessToken = useSelector((state) => state.auth.access_token);
  console.log("토큰",accessToken);
  const classData = useSelector((state) => state.accountS.classData)
  const completedData = useSelector((state) => state.accountS.completedData)
  // const [classData, setClassData] = useState([]);
  // const [completedData, setCompletedData] = useState([]);
  const [reviewLessonId, setReviewLessonId] = useState(null);
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

  const handleOpenModal = (lessonId) => {
    setIsModalOpen(true);
    setReviewLessonId(lessonId)
  };

  const handleCloseModal = () => {
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
      } else {
        console.log("쿠키 세션아이디 없어서 입장 불가")
      }
    }
  }, [session])

  const goLesson = (lessonId) => {
    setGoLessonDetail(true)
    dispatch(setLessonId(lessonId))
    navigate(`/lesson/${lessonId}`)
  }

  useEffect(() => {
    if (goLessonDetail && lessonId !== null) {
      navigate(`/lesson/${lessonId}`)
    }
  }, [lessonId])

  return (
    <div>
      <SideBar />
      {/* <button >리뷰작성</button> */}
      {/* {isModalOpen && <ReviewForm onClose={handleCloseModal} />} */}
      <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal}>
        <ReviewForm onClose={handleCloseModal} rating={rating} onClickRating={handleClickRating} lessonId={reviewLessonId} />
      </Modal>
      <div className="column is-10 main_container">
        <div className="header">
          <div className="summary">
            <dl className="summary__count">
              {/* <dt>과외 목록</dt> */}
              <h1>과외목록</h1>
              {/* <dd className="summary__count-all">2</dd> */}
            </dl>
          </div>
        </div>
          <div>
            <h2>신청한 과외</h2>
            {classData !== null && classData !== undefined && classData ? (
              classData.map((lesson)=> (
                <div key = {lesson.lessonId} className="columns is-multiline is-mobile courses_card_list_body" onClick={() => goLesson(lesson.lessonId)}>
                  <div className="column is-3-fullhd is-3-widescreen is-4-desktop is-4-tablet is-6-mobile ">
                    <div
                      className="card course course_card_item"
                      data-productid="324582"
                      fxd-data='{"courseId":324582,"regPrice":0,"isInCart":false}'
                      data-gtm-vis-recent-on-screen-8964582_476="200"
                      data-gtm-vis-first-on-screen-8964582_476="200"
                      data-gtm-vis-total-visible-time-8964582_476="100"
                      data-gtm-vis-has-fired-8964582_476="1"
                    >
                      <div className="course_card_front">
                        <div className="card-image">
                          <figure className="image is_thumbnail">
                            <img
                              loading="lazy"
                              src={lesson.thumbnailUrl}
                              // data-src="https://cdn.inflearn.com/public/courses/324582/course_cover/1ead1042-97cc-41f2-bc73-a6e86ae86a4d/nodeReact.png"
                              className="swiper-lazy"
                              alt="course_title.png"
                            />
                            <div className="onload_placeholder"></div>
                            <div className="swiper-lazy-preloader"></div>
                          </figure>
                        </div>
                        <div className="card-content">
                          <div className="course_title">과외명: {lesson.lessonTitle}</div>
                          <div className="course_title">
                          <dt>카테고리</dt>
                            <dd>
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
                            </dd>
                          </div>
                          <div className="instructor">쿠커: {lesson.cookyerName}</div>
                          <div className="view2_summary_info">
                            <dl className="info_delivery">
                              <dt>
                                {/* <img src="https://recipe1.ezmember.co.kr/img/mobile/icon_calendar.png" alt="기간아이콘" width="29" /> */}
                                과외 날짜:
                              </dt>
                              <dd>{new Date(lesson.lessonDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', hour: '2-digit', minute: '2-digit' })} 예정</dd>
                              {/* <dd>{new Date(lesson.lessonDate).toISOString().split("T")[0]} 예정</dd> */}
                              {lesson.sessionId === null ? (
                                <button disabled="disabled">수업예정</button>
                              ) : (
                                <button onClick={() => joinLesson(lesson.lessonId)}>참가하기</button>
                              )}
                            </dl>
                          </div>
                          <div className="rating">
                            <div className="rating_star">
                              <div className="star_solid" style={{ width: "98.26086956521738%" }}>
                                {/* ... (rest of the code) ... */}
                              </div>
                            </div>
                            <p className="card-content__notice"></p>
                            {/* <div className="tags">
                              <span className="tag" style={{ backgroundColor: "hsl(321,63%,90%)" }}>
                                수정시간:{new Date(lesson.modifiedDate).toISOString().split("T")[0]}
                              </span>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>신청한 과외가 없습니다.</p>
            )}
          </div>
          <div>
            <h2>완료한 과외</h2>
            {completedData !== null && completedData !== undefined && completedData ? (
              completedData.map((lesson)=> (
                <div key = {lesson.lessonId} className="columns is-multiline is-mobile courses_card_list_body" onClick={() => goLesson(lesson.lessonId)}>
                  <div className="column is-3-fullhd is-3-widescreen is-4-desktop is-4-tablet is-6-mobile ">
                    <div
                      className="card course course_card_item"
                      data-productid="324582"
                      fxd-data='{"courseId":324582,"regPrice":0,"isInCart":false}'
                      data-gtm-vis-recent-on-screen-8964582_476="200"
                      data-gtm-vis-first-on-screen-8964582_476="200"
                      data-gtm-vis-total-visible-time-8964582_476="100"
                      data-gtm-vis-has-fired-8964582_476="1"
                    >
                      <div className="course_card_front">
                        <div className="card-image">
                          <figure className="image is_thumbnail">
                            <img
                              loading="lazy"
                              src={lesson.thumbnailUrl}
                              // data-src="https://cdn.inflearn.com/public/courses/324582/course_cover/1ead1042-97cc-41f2-bc73-a6e86ae86a4d/nodeReact.png"
                              className="swiper-lazy"
                              alt="course_title.png"
                            />
                            <div className="onload_placeholder"></div>
                            <div className="swiper-lazy-preloader"></div>
                          </figure>
                        </div>
                        <div className="card-content">
                          <div className="course_title">과외명: {lesson.lessonTitle}</div>
                          <div className="course_title">
                          <dt>카테고리</dt>
                            <dd>
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
                            </dd>
                          </div>
                          <div className="instructor">쿠커: {lesson.cookyerName}({lesson.cookyerId})</div>
                          <div className="view2_summary_info">
                            <dl className="info_delivery">
                              <dt>
                                <img src="https://recipe1.ezmember.co.kr/img/mobile/icon_calendar.png" alt="기간아이콘" width="29" />
                                "과외 날짜"
                              </dt>
                              <dd>{new Date(lesson.lessonDate).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', hour: '2-digit', minute: '2-digit' })} 예정</dd>
                            </dl>
                          </div>
                          <div className="rating">
                            <div className="rating_star">
                              <div className="star_solid" style={{ width: "98.26086956521738%" }}>
                                {/* ... (rest of the code) ... */}
                              </div>
                            </div>
                            <p className="card-content__notice"></p>
                            {/* <div className="tags">
                              <span className="tag" style={{ backgroundColor: "hsl(321,63%,90%)" }}>
                                수정시간:{new Date(lesson.modifiedDate).toISOString().split("T")[0]}
                              </span>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleOpenModal(lesson.lessonId)}>리뷰작성</button>
                </div>
              ))
            ) : (
              <p>완료한 과외가 없습니다.</p>
            )}
          </div>
      </div>
    </div>
  );
}

export default ClassList;


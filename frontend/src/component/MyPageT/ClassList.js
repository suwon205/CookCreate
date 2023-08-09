import React,{useEffect} from 'react';
import SideBar from "./SideBar";
import { useDispatch, useSelector} from "react-redux";
import axios from 'axios';
import { initOVSession, setIsSessionOpened, setSessionId, setVideoLessonId } from '../../store/video/video';
import { OpenVidu } from 'openvidu-browser';
import { useNavigate } from 'react-router-dom';
import { setClassData, setCompletedData } from '../../store/mypageS/accountS';

function ClassList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // const accessToken = useSelector((state) => state.auth.access_token);
  const accessToken = localStorage.getItem('access_token')

  const classData = useSelector((state) => state.accountS.classData)
  const completedData = useSelector((state) => state.accountS.classData)
  // const [ classData, setClassData ] = useState([]);
  // const [ completedData, setCompletedData ] = useState([]);

  /** 쿠커 화상과외방 입장 */
  const session = useSelector((state) => state.video.session)
  const sessionId = useSelector((state) => state.video.sessionId)
  const videoLessonId = useSelector((state) => state.video.videoLessonId)
  const isSessionOpened = useSelector((state) => state.video.isSessionOpened)

  /** 1시간 전부터 과외방 생성 가능 */ // 일단 새고해야 알 수 있는걸로..
  const currentDate = new Date()

  useEffect(() => {
    axios
      .get(`api/v1/my/applied`, {
        headers: {
          Access_Token: accessToken,
        },
      })
      .then((res) => {
        // setClassData(res.data);
        dispatch(setClassData(res.data))
        console.log("신청한 과외", res.data);
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
        // setCompletedData(res.data);
        dispatch(setCompletedData(res.data))
        console.log("완료한 과외", res.data);
      })
      .catch((err) => {
        console.log("완료한 과외 조회 에러", err);
        // 에러 처리 로직 추가 가능
      });
    }, []);

  /** 쿠커 화상과외방 생성 및 입장 */
  const createRoom = ( lessonId ) => {
    // 0. 레슨아이디 스토어에 저장
    dispatch(setVideoLessonId(lessonId))
  }

  // 1. 레슨아이디가 잘 저장되면 선생님이 해당 수업 방 만들기 요청 보내기
  useEffect(() => {
    if (videoLessonId !== undefined) {
      console.log(videoLessonId, "레슨번호")
      console.log("토큰", accessToken)
      axios.post(
        `api/v1/session/create`,
        { 'lessonId': videoLessonId },
        {
          headers: {
            access_token: accessToken
          }
        })
        .then((res) => {
          // console.log('방 만들기 요청 성공', res)
          console.log('쿠커 세션아이디 생성 성공', res)
          const sessionId = res.data.token
          dispatch(setSessionId(sessionId))
          // dispatch(setMySessionId(res.data)) // 토큰이랑 커넥션 설정하는걸로 바꾸기?
        })
        .catch((err) => {
          console.log('쿠커 세션아이디 생성 실패', err)
        })
      
    } else {
      console.log("레슨아이디 없음")
    }
  }, [videoLessonId])

  // 2. 토큰이 생기면 이동 OV, session 객체 생성
  useEffect(() => {
    if (sessionId) {
      const newOV = new OpenVidu()
      const newSession = newOV.initSession()
      dispatch(initOVSession({OV: newOV, session: newSession}))
    }
  }, [sessionId])

  // 3. 세션이 생기면 방 열렸다 체크 / 쿠키는 바로 입장
  // useEffect(() => {
  //   if (session !== undefined) {
  //     navigate(`/videoLesson/${role}`)
  //   }
  // }, [session])

  useEffect(() => {
    if (session) {
      console.log("방 생김")
      dispatch(setIsSessionOpened(true))
    }
  }, [session])

  // **4.
  useEffect(() => {
    if (isSessionOpened && sessionId) {
      console.log(isSessionOpened, "방이 열렸어요")
      navigate(`/videoLesson/COOKYER`)
    }
  }, [isSessionOpened])

  /** 과외 수정 */
  const updateClass = ( lessonId ) => {
    navigate(`/lesson/edit/${lessonId}`)
  }

  /** 과외 삭제 */
  const deleteClass = ( lessonId ) => {
    axios.delete(
      `api/v1/lesson/${lessonId}`,
      {
        headers: {
          Access_Token: accessToken
        }
      }
    )
    .then((res) => {
      console.log('쿠커 과외 삭제 성공', res)
    })
    .catch((err) => {
      console.log('쿠커 과외 삭제 실패', err)
      let error = Object.assign({}, err)
      if (error?.response?.status === 409) {
        alert('신청한 쿠키가 있어 수업을 삭제할 수 없습니다.')
      }
    })
  }

  return (
    <div>
        <SideBar />
        <div className="column is-10 main_container">
          <div className="header">
            <div className="summary">
              <dl className="summary__count">
                <h1>과외목록</h1>
              </dl>
            </div>
          </div>
            <div>
              <h2>신청한 과외</h2>
              {classData !== null && classData !== undefined && classData ? (
                classData.map((lesson)=> (
                  <div key = {lesson.lessonId} className="columns is-multiline is-mobile courses_card_list_body">
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
                        {/* <a className="course_card_front" href="ㅔㅔㅔㅔ"> */}
                          <div className="card-image">
                            <figure className="image is_thumbnail">
                              <img
                                loading="lazy"
                                src="https://cdn.inflearn.com/public/courses/324582/course_cover/1ead1042-97cc-41f2-bc73-a6e86ae86a4d/nodeReact.png"
                                data-src="https://cdn.inflearn.com/public/courses/324582/course_cover/1ead1042-97cc-41f2-bc73-a6e86ae86a4d/nodeReact.png"
                                className="swiper-lazy"
                                alt="course_title.png"
                              />
                              <div className="onload_placeholder"></div>
                              <div className="swiper-lazy-preloader"></div>
                            </figure>
                            <span className="course_cnt">강의번호:{lesson.lessonId}</span>
                          </div>
                          <div className="card-content">
                            <div className="course_title">강좌명:{lesson.lessonTitle}</div>
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
                            <div className="date">신청날짜: {lesson.createdDate}</div>
                            <div className="price">가격:{lesson.price}</div>
                            <div className="difficulty">난이도:{lesson.difficulty}</div>
                            <div className="time">찜:{lesson.jjimCount}</div>
                            <div className="view2_summary_info">
                              <dl className="info_delivery">
                                <dt>
                                  <img src="https://recipe1.ezmember.co.kr/img/mobile/icon_clock2.png" alt="시간아이콘" width="29" />
                                  "소요시간"
                                </dt>
                                <dd>{lesson.timeTaken}분</dd>
                              </dl>
                              <dl className="info_delivery">
                                <dt>
                                  <img src="https://recipe1.ezmember.co.kr/img/mobile/icon_calendar.png" alt="기간아이콘" width="29" />
                                  "과외 날짜"
                                </dt>
                                <dd>{lesson.lessonDate} 예정</dd>
                                {new Date(lesson.lessonDate) <= currentDate.setHours(currentDate.getHours() + 1) ? (
                                  <button onClick={() => createRoom(lesson.lessonId)}>수업시작</button>
                                ) : (
                                  <button disabled='disabled'>수업시작</button>
                                )}
                              </dl>
                              <div className="info_ea">
                                <img src="https://recipe1.ezmember.co.kr/img/mobile/icon_people.png" alt="수강아이콘" width="29" style={{ paddingRight: "5px", verticalAlign: "text-bottom" }} />
                                <b>"{lesson.remaining}"명 남음.</b>
                                  최대인원:{lesson.maximum}명
                              </div>
                            </div>
                            <div className="rating">
                              <div className="rating_star">
                                <div className="star_solid" style={{ width: "98.26086956521738%" }}>
                                  {/* ... (rest of the code) ... */}
                                </div>
                              </div>
                              <p className="card-content__notice"></p>
                              <div className="tags">
                                <span className="tag" style={{ backgroundColor: "hsl(321,63%,90%)" }}>
                                  수정시간:{lesson.modifiedDate}
                                </span>
                                <button onClick={() => updateClass(lesson.lessonId)}>수정</button>
                                <button onClick={() => deleteClass(lesson.lessonId)}>삭제</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : null}
            </div>
            <div>
              <h2>완료한 과외</h2>
              {completedData !== null && completedData !== undefined && completedData ? (
                completedData.map((lesson)=> (
                  <div key = {lesson.lessonId} className="columns is-multiline is-mobile courses_card_list_body">
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
                        {/* <a className="course_card_front" href="ㅔㅔㅔㅔ"> */}
                          <div className="card-image">
                            <figure className="image is_thumbnail">
                              <img
                                loading="lazy"
                                src="https://cdn.inflearn.com/public/courses/324582/course_cover/1ead1042-97cc-41f2-bc73-a6e86ae86a4d/nodeReact.png"
                                data-src="https://cdn.inflearn.com/public/courses/324582/course_cover/1ead1042-97cc-41f2-bc73-a6e86ae86a4d/nodeReact.png"
                                className="swiper-lazy"
                                alt="course_title.png"
                              />
                              <div className="onload_placeholder"></div>
                              <div className="swiper-lazy-preloader"></div>
                            </figure>
                            <span className="course_cnt">강의번호:{lesson.lessonId}</span>
                          </div>
                          <div className="card-content">
                            <div className="course_title">강좌명:{lesson.lessonTitle}</div>
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
                            <div className="date">신청날짜: {lesson.createdDate}</div>
                            <div className="price">가격:{lesson.price}</div>
                            <div className="difficulty">난이도:{lesson.difficulty}</div>
                            <div className="time">찜:{lesson.jjimCount}</div>
                            <div className="view2_summary_info">
                              <dl className="info_delivery">
                                <dt>
                                  <img src="https://recipe1.ezmember.co.kr/img/mobile/icon_clock2.png" alt="시간아이콘" width="29" />
                                  "소요시간"
                                </dt>
                                <dd>{lesson.timeTaken}분</dd>
                              </dl>
                              <dl className="info_delivery">
                                <dt>
                                  <img src="https://recipe1.ezmember.co.kr/img/mobile/icon_calendar.png" alt="기간아이콘" width="29" />
                                  "과외 날짜"
                                </dt>
                                <dd>{lesson.lessonDate} 완료</dd>
                              </dl>
                              <div className="info_ea">
                                <img src="https://recipe1.ezmember.co.kr/img/mobile/icon_people.png" alt="수강아이콘" width="29" style={{ paddingRight: "5px", verticalAlign: "text-bottom" }} />
                                <b>"{lesson.remaining}"명 남음.</b>
                                  최대인원:{lesson.maximum}명
                              </div>
                            </div>
                            <div className="rating">
                              <div className="rating_star">
                                <div className="star_solid" style={{ width: "98.26086956521738%" }}>
                                  {/* ... (rest of the code) ... */}
                                </div>
                              </div>
                              <p className="card-content__notice"></p>
                              <div className="tags">
                                <span className="tag" style={{ backgroundColor: "hsl(321,63%,90%)" }}>
                                  수정시간:{lesson.modifiedDate}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* </a> */}
                      </div>
                    </div>
                  </div>
                ))
              ) : null}
            </div>
        </div>
      </div>
  );
}

export default ClassList;
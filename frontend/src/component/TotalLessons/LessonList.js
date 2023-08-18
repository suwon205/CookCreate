import React, { useState, useEffect } from "react";
import LessonItem from "./LessonItem";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "../../style/lesson/lessonListCss.css";
import { useNavigate } from "react-router-dom";
import { setLessonId } from "../../store/lesson/lessonInfo";
import { resetlessonSearch, setResult } from "../../store/lesson/lessonSearch";
import AlertModal from "../Modal/AlertModal";
function LessonList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [lessons, setLessons] = useState([]);
  const type = useSelector((state) => state.lessonSearch.type);
  const deadline = useSelector((state) => state.lessonSearch.deadline);
  const order = useSelector((state) => state.lessonSearch.order);
  const category = useSelector((state) => state.lessonSearch.category);
  const keyword = useSelector((state) => state.lessonSearch.keyword);
  const isLogin = useSelector((state) => state.auth.isLogin);
  const lessons = useSelector((state) => state.lessonSearch.result);

  const [modalOpen, setModalOpen] = useState(false);

  const keywordFromSearchBar = useSelector(
    (state) => state.searchBarKeyword.keyword
  );

  const handleLessonDetail = (lessonId) => {
    navigate(`/lesson/${lessonId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const gotoLogin = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setModalOpen(true);
  };
  useEffect(() => {
    if (keywordFromSearchBar !== "") {
      axios
        .get(`/api/v1/lesson`, {
          params: {
            type,
            keyword: keywordFromSearchBar,
            category,
            order,
            deadline,
          },
        })
        .then((res) => {
          console.log("내브바 서치바");
          dispatch(setResult(res.data));
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      axios
        .get(`/api/v1/lesson`, {
          params: {
            type,
            keyword,
            category,
            order,
            deadline,
          },
        })
        .then((res) => {
          dispatch(setResult(res.data));
          console.log("메인 서치바");
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [keywordFromSearchBar, type, order, keyword, category, deadline]);

  return (
    <div className="lessonListContainer">
      {modalOpen && (
        <AlertModal
          content={"로그인 후 시도해주세요!"}
          path={"/login"}
          actions={closeModal}
          data={false}
        />
      )}
      {lessons.length > 0 ? (
        lessons.map((lesson) => (
          <div
            key={lesson.lessonId}
            className="lessonItemContainer"
            style={{
              padding: "20px",
              marginTop: "20px",
            }}
            onClick={() => {
              if (isLogin) {
                dispatch(setLessonId(lesson.lessonId));
                handleLessonDetail(lesson.lessonId);
              } else {
                gotoLogin();
              }
            }}
          >
            <LessonItem
              id={lesson.lessonId}
              title={lesson.lessonTitle}
              date={lesson.lessonDate}
              thumbnailUrl={lesson.thumbnailUrl}
              reviewAvg={lesson.reviewAvg}
              cookyerName={lesson.cookyerName}
              categoryId={lesson.categoryId}
              difficulty={lesson.difficulty}
            />
          </div>
        ))
      ) : (
        <p>아직 과외가 개설되지 않았습니다.</p>
      )}
    </div>
  );
}

export default LessonList;

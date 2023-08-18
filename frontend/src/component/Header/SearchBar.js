import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import SearchResModal from "./SearchResModal";
import "../../style/searchBar.css";
import { setLessonId } from "../../store/lesson/lessonInfo";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { setSearchBarKeyword } from "../../store/lesson/searchBarKeyword";
function SearchBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [isexist, setIsExist] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState([]);

  const deadline = true;
  const type = "title";
  const order = "title";
  const category = [];

  useEffect(() => {
    axios
      .get(`/api/v1/lesson`, {
        params: {
          type,
          keyword,
          deadline,
          order,
          category,
        },
      })
      .then((res) => {
        setResult(res.data);
        if (result.length > 0 && keyword !== "") {
          setIsExist(true);
          setIsOpen(true);
        } else {
          setIsExist(false);
          setIsOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [keyword]);

  useEffect(() => {
    setIsExist(result.length > 0 && keyword !== '');
    setIsOpen(result.length > 0 && keyword !== '');
  }, [result, keyword]);

  //검색 후 item 누르면 이동
  const searchResClick = (lessonId) => {
    dispatch(setLessonId(lessonId));
    setIsOpen(false);
    navigate(`lesson/${lessonId}`);
    setKeyword(keyword)
  };
  const handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
      navigate(`/lesson`)
      window.scrollTo({ top: 0, behavior: 'smooth' });
      dispatch(setSearchBarKeyword(keyword))
      console.log(keyword)
      setKeyword('')
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const searchResult = document.getElementById('searchResult');
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', () => {
      const inputValue = searchInput.value.trim();

      if (inputValue) {
        searchResult.style.display = 'block';
        searchInput.textContent = inputValue;
      } else {
        searchResult.style.display = 'none';
      }  
    });

    document.addEventListener('click', (event) => {
      // 클릭된 요소와 targetDiv가 부모-자식 관계인지 확인
      if (!searchResult.contains(event.target) && event.target !== searchInput) {
        searchResult.style.display = 'none';
      }
    });
  });
  

  return (
    <div className="mainSearchContainer">
      <div className="mainSearch-wrap">
        <BiSearch className="mainSearchIcon" />
        <input
          id ="searchInput"
          type="text"
          className="searchBar"
          placeholder="요리를 검색해보세요!"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
          onKeyDown={handleSearchEnter}
        />
      </div>
      <div className="search-result" id="searchResult">
        {isexist &&
          isOpen &&
          result.map((obj, idx) => (
            <div className="search-result-item" onClick={() => searchResClick(obj.lessonId)} key={idx}>
              <SearchResModal key={idx} lessonTitle={obj.lessonTitle} lessonId={obj.lessonId} />
            </div>
          ))}
        </div>
    </div>
  );
}

export default SearchBar;
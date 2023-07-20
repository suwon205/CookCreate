import React, {useState} from 'react';
import { Link } from 'react-router-dom';
function NavBar() {
  const plzEdit = () => {
    console.log('페이지 덜 만들었어요. 링크 수정해야 합니다.')
  }
  const [searchEverything, setsearchEverything] = useState('')
  
  const handleSearchBar = (e) => {
    e.preventDefault()
    console.log('검색 api 끌고 오기')
    setsearchEverything('')
  }
  return (
    <div>
      <Link to ='/'>
        로고
      </Link> |
      <span onClick={plzEdit}>
        수업 랭킹
      </span> |
      <span onClick={plzEdit}>
        수업 전체
      </span>
      <input type="text" 
        placeholder='아무거나 검색하세요!'
        value = {searchEverything}
        onChange={(e) => {
          setsearchEverything(e.target.value)
        }}
        onKeyPress={handleSearchBar}
      />
      <Link to = 'login'>
        로그인
      </Link> |
      <Link to ='signup'>
        회원가입
      </Link>
    </div>
  );
}
export default NavBar;
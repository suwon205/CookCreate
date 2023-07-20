import React, {useState} from 'react';
function MainPage() {
  const [chooseUserType, setUserType] = useState('cookyer')
  const [searchRecipe, setsearchRecipe] = useState('')
  const gotoGesture = () => {
    console.log('제스처 체험 해보는 곳. 아직 구현 안 했어요')
  }
  const handleCookyerButtonClick = () => {
    setUserType('cookyer');
  };

  const handleCookieeButtonClick = () => {
    setUserType('cookiee');
  };

  const gotoSearch = () => {
    console.log({searchRecipe})
    // 검색 기능으로 갈 함수
  }
  return (
    <div>
      <div className='introduceApp'>
        <div className='appTitle'>Cook Create</div>
        <div className='appContent'>
          전문 강사진과 함께 하는
          <br />
          실시간 화상 쿠킹 클래스를 만나보세요!
        </div>
      </div>
      <div className='searchBar'>
        <input type="text" 
        value = {searchRecipe}
        placeholder='배우고 싶은 요리를 검색해 보세요!'
        onChange = {(e) => {
          setsearchRecipe(e.target.value)
        }}/>
        <button onClick={
          gotoSearch
        }>검색하기</button>
      </div>
      <div className='coreFunction' style={{
        border: '1px solid #ccc',
        padding: '20px',
        marginTop: '20px',
      }}>
        핵심 기능 설명하는 div
      </div>

      <div> 
        <div className='chooseType'>
          <button onClick={handleCookyerButtonClick}>Cookyer 쿠커</button> |
          <button onClick={handleCookieeButtonClick}>Cookiee 쿠키</button>
        </div>
        <div className='introduceType'>
          <div className='typeName'>
            {chooseUserType === 'cookyer' ? <div>쿠커</div> : <div>쿠키</div>}
          </div>
          <div className='typeStep'>
            {chooseUserType === 'cookyer' ? 
            <div>
              <div>
                등록: 강의를 올린다
              </div>
              <div>
                모집: 수강생을 모집한다
              </div>
              <div>
                요리: 수업한다 당신의 지식을 나눠주세요~
              </div>
            </div> :
             <div>
              <div>
                검색: 검색하세요! 카테고리, 선생님 아무 키워드나 괜찮습니다.
              </div>
              <div>
                신청: 신청하세요! 선생님이 확인 후 답변을 빠르게 드립니다.
              </div>
              <div>
                요리: 같이 요리하세요! (굿)
              </div>
              </div>}
          </div>
        </div>
      </div>

      <button onClick={gotoGesture}>제스처 동작 체험 해보기</button>
    </div>
  );
}

export default MainPage;
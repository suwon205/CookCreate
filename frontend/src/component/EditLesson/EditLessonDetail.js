import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPrice, setPriceValid, setMaximum, setMaximumValid, setDifficulty, setDescription, 
  setVideoUrl, setMaterials, setDifficultyValid, setDescriptionValid, setMaterialsValid } from '../../store/lesson/lessonEdit';

function EditLessonDetail() {
  const dispatch = useDispatch();
  const initPrice = useSelector((state) => state.lessonInfo.price)
  const initMaximum = useSelector((state) => state.lessonInfo.maximum)
  const initDifficulty = useSelector((state) => state.lessonInfo.difficulty)
  const initVideoUrl = useSelector((state) => state.lessonInfo.videoUrl)
  const initDescription = useSelector((state) => state.lessonInfo.description)
  const initMaterial = useSelector((state) => state.lessonInfo.materials)

  const [lessonPrice, setLessonPrice] = useState(initPrice);
  const [maximum, setLessonMaximum] = useState(initMaximum);
  const [lessonDifficulty, setLessonDifficulty] = useState(initDifficulty);
  const [selectedDifficulty, setSelectedDifficulty] = useState(initDifficulty);
  const [lessonDescription, setLessonDescription] = useState(initDescription)
  const [lessonVideoUrl, setLessonVideoUrl] = useState(initVideoUrl)
  const [lessonMaterialList, setLessonMaterialList] = useState(initMaterial)
  const [lessonMaterial, setLessonMaterial] = useState('')
  //유효성
  const priceValid = useSelector((state) => state.lessonEdit.priceValid)
  const [errorMsg, setErrorMsg] = useState('');
  const maxValid = useSelector((state) => state.lessonEdit.maxValid)
  const difficultyValid = useSelector((state) => state.lessonEdit.difficultyValid)
  const descriptionValid = useSelector((state) => state.lessonEdit.descriptionValid)
  const materialValid = useSelector((state) => state.lessonEdit.materialsValid)

  const handleChangePrice = (e) => {
    const input = e.target.value
    if (isNaN(input)) {
      setErrorMsg('숫자만 입력해주세요!')
    } else {
      setErrorMsg('')
      setLessonPrice(input)
      dispatch(setPrice(input))
      dispatch(setPriceValid(input.trim() !== ""))
    }
  };
  const changeMaximum = (e) => {
    const input = e.target.value
    setLessonMaximum(input)
    dispatch(setMaximum(input))
    dispatch(setMaximumValid(input.trim() !== ''))
  };

  const handleDifficultyClick = (difficulty) => {
    setLessonDifficulty(difficulty);
    setSelectedDifficulty(difficulty)
    dispatch(setDifficultyValid(true))
  };
  const handleLessonDescription = (e) =>{
    const input = e.target.value
    setLessonDescription(input)
    dispatch(setDescription(input))
    dispatch(setDescriptionValid(input.trim() !== ''))
  }

  const handleVideoUrl = (e) => {
    setLessonVideoUrl(e.target.value)
  }
  const handleChange = (e) => {
    setLessonMaterial(e.target.value)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const newList = lessonMaterial.split('\n').map((str) => str.trim()).filter((str) => str !== '');
    setLessonMaterialList(newList)
    dispatch(setMaterialsValid(lessonDescription.trim() !== '' || newList.length > 0));

  }


  useEffect(() => {
    dispatch(setPrice(lessonPrice));
    dispatch(setMaximum(maximum));
    dispatch(setDifficulty(lessonDifficulty))
    dispatch(setDescription(lessonDescription))
    dispatch(setVideoUrl(lessonVideoUrl))
    dispatch(setMaterials(lessonMaterialList))
  }, [dispatch, lessonPrice, maximum, lessonDifficulty, lessonDescription,
      lessonVideoUrl, lessonMaterialList]);

  return (
    <div>
      {/* 수강료 */}
      <div style={{display : 'flex', alignItems : 'center'}}>
        <div>
          <div style={{display : 'flex', alignItems : 'center'}}>
            <h3>수강료</h3>
            <div style={{marginLeft : '5px'}}>{priceValid ? '✅' : '🔲'}</div>
          </div>
          <div> 
            <input
              type="text"
              min="0"
              placeholder="수강료"
              value={lessonPrice}
              onChange={handleChangePrice}
              />
          </div>
          {errorMsg && <div style={{ color: 'red' }}>{errorMsg}</div>}
        </div>
        {/* 최대 수강 인원 */}
        <div>
          <div style={{display : 'flex', alignItems : 'center'}}>
            <h3>최대 수강 인원</h3>
            <div style={{marginLeft : '5px'}}>{maxValid ? '✅' : '🔲'}</div>
          </div>
          <select value={maximum} onChange={changeMaximum}>
            <option value="">-</option>
            <option value="1">1명</option>
            <option value="2">2명</option>
            <option value="3">3명</option>
            <option value="4">4명</option>
            <option value="5">5명</option>
            <option value="6">6명</option>
          </select>
        </div>
      </div>
      {/* 난이도 */}
      <div>
        <div style={{display : 'flex', alignItems : 'center'}}>
          <h3>강의 난이도</h3>
          <div style={{marginLeft : '5px'}}>{difficultyValid ? '✅' : '🔲'}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            onClick={() => handleDifficultyClick('EASY')}
            style={{ 
              backgroundColor: selectedDifficulty === 'EASY' ? 'lightgray' : 'white',
              padding : '5px',
              marginRight : '5px',
              cursor : 'pointer'
             }}
          >
            EASY
          </div>
          <div
            onClick={() => handleDifficultyClick('NORMAL')}
            style={{ 
              backgroundColor: selectedDifficulty === 'NORMAL' ? 'lightgray' : 'white',
              padding : '5px',
              marginRight : '5px',
              cursor : 'pointer' 
            }}
          >
            NORMAL
          </div>
          <div
            onClick={() => handleDifficultyClick('HARD')}
            style={{ 
              backgroundColor: selectedDifficulty === 'HARD' ? 'lightgray' : 'white',
              padding : '5px',
              cursor : 'pointer'
            }}
          >
            HARD
          </div>
        </div>
      </div>
      {/* 과외 설명 */}
      <div>
        <div style={{display : 'flex', alignItems : 'center'}}>
          <h3>과외 설명</h3>
          <div style={{marginLeft : '5px'}}>{descriptionValid ? '✅' : '🔲'}</div>
        </div>
        <input type="text"
          value={lessonDescription}
          onChange={handleLessonDescription}
          placeholder='과외 설명'
        />
      </div>


      {/* 유튜브 링크 */}
      <div>
        <h3>맛보기 영상 링크(선택사항)</h3>
        <div>
          <input type="text"
            value={lessonVideoUrl}
            onChange={handleVideoUrl}
            placeholder='맛보기 영상의 주소를 올려주세요!'
            />
        </div>
      </div>
      
      <div style={{display : 'flex', alignItems : 'center'}}>
      <h3>준비물 입력</h3>
      <div style={{marginLeft : '5px'}}>{materialValid ? '✅' : '🔲'}</div>
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={lessonMaterial}
          onChange={handleChange}
          placeholder="재료를 입력하세요. 각 재료들을 새 줄로 입력해주시면 됩니다."
          rows={5}
          cols={40}
        />
        <button type="submit">수정하기</button>
      </form>

      <div>
        <h3>준비물 리스트</h3>
        <div>
          {lessonMaterialList !== undefined && lessonMaterialList !== null && lessonMaterialList ? (
            lessonMaterialList.map((str, index) => (
              <div key={index}>{str}</div>
            ))
          ) : null}
        </div>
      </div>



    </div>
  );
}

export default EditLessonDetail;
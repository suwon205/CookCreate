import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPrice, setPriceValid, setMaximum, setMaximumValid, setDifficulty, setDescription, 
  setVideoUrl, setMaterials, setThumbnail, setDifficultyValid, setDescriptionValid, setMaterialsValid } from '../../store/lesson/lesson';

function LessonDetail() {
  const dispatch = useDispatch();
  const [lessonPrice, setLessonPrice] = useState('');
  const [maximum, setLessonMaximum] = useState('');
  const [lessonDifficulty, setLessonDifficulty] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [lessonDescription, setLessonDescription] = useState('')
  const [lessonVideoUrl, setLessonVideoUrl] = useState('')
  const [lessonMaterialList, setLessonMaterialList] = useState([])
  const [lessonMaterial, setLessonMaterial] = useState('')
  const [lessonThumbnailUrl, setLessonThumbnailUrl] = useState('')
  //유효성
  const priceValid = useSelector((state) => state.lesson.priceValid)
  const [errorMsg, setErrorMsg] = useState('');
  const maxValid = useSelector((state) => state.lesson.maxValid)
  const difficultyValid = useSelector((state) => state.lesson.difficultyValid)
  const descriptionValid = useSelector((state) => state.lesson.descriptionValid)
  const materialValid = useSelector((state) => state.lesson.materialsValid)

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
  const handleThumbnailUrl = (e) => {
    const imageInput = document.getElementById('imageInput')
    imageInput.addEventListener('change', (event) => {
      const selectedFile = event.target.files[0]; // 첫 번째 파일만 선택
    
      if (selectedFile) {
        console.log('File name:', selectedFile.name);
        console.log('File type:', selectedFile.type);
        console.log('File size:', selectedFile.size, 'bytes');
        console.log('Last modified date:', selectedFile.lastModifiedDate);
      }
    });
    console.log(imageInput)
    // if (imageInput) {
    //   console.log(imageInput.files)

    // } else {
    //   console.log("파일 첨부 안됨")
    // }
    console.log(typeof(e.target.value), e.target.value)
    setLessonThumbnailUrl(e.target.value)
  }
  // const submitThumbnailUrl = (e) => {
  //   e.preventDefault()
  //   console.log("submit")
  //   // console.log(typeof(lessonThumbnailUrl), lessonThumbnailUrl)
  //   // setLessonThumbnailUrl(e.target.value)
  //   // setLessonThumbnailUrl(lessonThumbnailUrl)
  // }
  useEffect(() => {
    dispatch(setPrice(lessonPrice));
    dispatch(setMaximum(maximum));
    dispatch(setDifficulty(lessonDifficulty))
    dispatch(setDescription(lessonDescription))
    dispatch(setVideoUrl(lessonVideoUrl))
    dispatch(setMaterials(lessonMaterialList))
    dispatch(setThumbnail(lessonThumbnailUrl))
  }, [dispatch, lessonPrice, maximum, lessonDifficulty, lessonDescription,
      lessonVideoUrl, lessonMaterialList, lessonThumbnailUrl]);

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
            {Array.from({ length: 6 }, (_, index) => index + 1).map((value) => (
              <option key={value} value={value}>
                {value}명
              </option>
            ))}
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
            onClick={() => handleDifficultyClick('MEDIUM')}
            style={{ 
              backgroundColor: selectedDifficulty === 'MEDIUM' ? 'lightgray' : 'white',
              padding : '5px',
              marginRight : '5px',
              cursor : 'pointer' 
            }}
          >
            MEDIUM
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

      {/* 썸네일 */}
      <div>
        <h3>과외 썸네일</h3>
        <div>
          <input type="file"
            name = "filename"
            value={lessonThumbnailUrl}
            onChange={(e) => handleThumbnailUrl(e)}
            id='imageInput'
            // onChange={handleThumbnailUrl}
          />
        </div>
      </div>
      {/* <form method="post" entype="multipart/form-data" onSubmit={submitThumbnailUrl}>
        <h3>과외 썸네일</h3>
        <div>
          <input type="file"
            value={lessonThumbnailUrl}
            // onChange={handleThumbnailUrl}
            onChange={(e) => handleThumbnailUrl(e)}
            // onChange={handleThumbnailUrl}
          />
        </div>
        <button type='submit'>첨부하기</button>
      </form> */}
      
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
        <button type="submit">입력 완료</button>
      </form>

      <div>
        <h3>준비물 리스트</h3>
        <div>
          {lessonMaterialList.map((str, index) => (
            <div key={index}>{str}</div>
          ))}
        </div>
      </div>



    </div>
  );
}

export default LessonDetail;
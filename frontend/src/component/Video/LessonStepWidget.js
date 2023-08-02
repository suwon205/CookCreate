import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCheckCookiee, setCheckCookieeList } from '../../store/video/cookyerVideo';

function LessonStepWidget() {
  const dispatch = useDispatch()
  const checkCookieeList = useSelector((state) => state.cookyerVideo.checkCookieeList)
  const [ checkCount, setCheckCount ] = useState(0)
  const publisher = useSelector((state) => state.video.publisher)

  const resetCheck = (publisher) => {
    dispatch(setCheckCookieeList({checkCookieeList: []}))
    setCheckCount(0)
    dispatch(setCheckCookiee({checkCookiee: ''}))
    // 학생들에게도 리셋 시그널 보내야 함
    publisher.stream.session.signal({
      type: 'resetCheck'
    })
  }

  useEffect(() => {
    if (checkCookieeList !== undefined && checkCookieeList !== []) {
      setCheckCount(checkCookieeList.length)
    }
  }, [checkCookieeList])

  return (
    <div>
      <div>
        <p>현재 진행 단계</p>
        <div>
          <button>이전</button>
          <div>
            <p>강사가 미리 설정한 요리 단계</p>
            <button>수정</button>
          </div>
          <button>이후</button>
        </div>
        <div>
          <h1>체크 {checkCount}명</h1>
          <button onClick={() => resetCheck(publisher)}>리셋</button>
        </div>
      </div>
      <div>
      </div>
    </div>
  );
}

export default LessonStepWidget;
import React from 'react';
import { useSelector } from 'react-redux';
import '../../style/lesson/cookieeNumberCss.css';

function CookieeNumber() {
  const maximum = parseInt(useSelector((state) => state.lessonInfo.maximum))
  const remaining = parseInt(useSelector((state) => state.lessonInfo.remaining)) //남은 인원 수
  const current = maximum - remaining
  const currentStyle = {
    fontSize: '24px', // 크기를 키우려면 적절한 값을 설정하세요
    color: '#ff0000', // 원하는 색상으로 변경하세요
  };

  return (
    <div className='cookieeNumberContainer'>
      <div className='cookieeNumberFlexContainer'>
        <span className='cookieeNumberTitle'> 수강 인원 </span>
        <span className='cookieeNumberCurrentContainer'>
          <span className='cookieeNumberCurrent'>{current}</span>
          <span className='cookieeNumberDesc'>명</span>
          <span className='cookieeNumberMax'>/{maximum}명</span>
        </span>
      </div>
    </div>
  );
}

export default CookieeNumber;
import React from 'react';
import '../../style/mainpage/introduceApp.css'
import { BsChevronCompactDown } from 'react-icons/bs'

function IntroduceApp() {
  return (
    <div>
      <div className='bg'></div>
      <div className='mainpageContent'>  
        <div className='animation-container'>
          <div className='topContent'>     
            <div className='mainTitle'>Cook Create</div>
            {/* <div className='mainText'>함께 요리하고, 궁금한 점이 있으면 바로 손을 드세요. </div>    */}
            <div className='mainText'>실시간으로 피드백을 해주는 내 옆의 선생님, 쿡크</div>
          </div>
        </div>
        <BsChevronCompactDown className="down-icon"/>
      </div>
    </div>
  );
}

export default IntroduceApp;
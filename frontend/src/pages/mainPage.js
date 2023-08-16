import React from 'react';
import IntroduceCC from '../component/MainPage/IntroduceCC'
import CoreFunction from '../component/MainPage/CoreFunction';
import GoToGesture from '../component/MainPage/GoToGesture';
import IntroduceApp from '../component/MainPage/IntroduceApp';
import IntroduceSub from "../component/MainPage/IntroduceSub";
function mainPage() {
  return (
    <div>
      <IntroduceApp />
      <IntroduceSub/>
      <CoreFunction />
      {/* <GoToGesture/> */}
    </div>
  );
}

export default mainPage;
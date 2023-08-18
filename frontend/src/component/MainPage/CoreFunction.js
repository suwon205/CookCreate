import React, { useEffect} from 'react';
import '../../style/mainpage/coreFunction.css'
import GoToGesture from './GoToGesture';

function CoreFunction() {
  useEffect(() => {
    // 페이지 전환 시 실행할 초기화 코드

    function handleScroll() {
      const elements = document.querySelectorAll('.coreWrap');
      const imgElements = document.querySelectorAll('.core-img-wrap');

      let animated = Array.from(elements).fill(false);
      let imgAnimated = Array.from(imgElements).fill(false);

      elements.forEach((element, index) => {
        // 요소가 화면 중앙에 보일 때 클래스를 추가하여 나타나게 함
        const elementTop = element.getBoundingClientRect().top;
        // const windowHeight = window.innerHeight;
        // console.log(elementTop + " " + windowHeight);
      
        if (elementTop < 500 && !animated[index]) {
          element.classList.add('visible');
          animated[index] = true;
        }
      });

      imgElements.forEach((element, index) => {
        // 요소가 화면 중앙에 보일 때 클래스를 추가하여 나타나게 함
        const elementTop = element.getBoundingClientRect().top;
        // const windowHeight = window.innerHeight;
        // console.log(elementTop + " " + windowHeight);
      
        if (elementTop < 400 && !imgAnimated[index]) {
          element.classList.add('visibleImg');
          imgAnimated[index] = true;
        }
      });


    };
    window.addEventListener('scroll', handleScroll);
    // 반환된 함수는 컴포넌트가 언마운트되거나 업데이트되기 직전에 실행됨
    return () => {
      // 스크롤 이벤트 리스너 제거
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  
  return (
    <div className="coreContainer">
      <div className="core-wrap-wrap">
        <div className="coreWrap">
          {/* <div className="function-sub-title">
            제스처
          </div> */}
          <div className="function-title">
            마우스 클릭없이
            <br/>
            제스처 하나로 간편하게,
            <br/>
            이런 화상 과외 써보셨나요?
          </div>
          <GoToGesture/>
        </div>  
      </div>
      <div className="core-wrap-wrap">
        <div className="coreWrap">
          <div className="coreSubTitle">
            체크
          </div>
          <div className="coreTitle">
            브이자 한번으로
            <br />
            완료 사실을 알려보세요.
          </div>
          <div className="coreDescription">
            현재 진행 중인 단계를 모두 수행했다면
            <br/>
            체크 제스쳐를 해보세요.
            <br/>
            선생님께 내 진행 상황을 손 쉽게 알릴 수 있어요.
          </div>
        </div>
        <div className="core-img-wrap">
          <img src="/check.png" alt="진행 단계 체크" className="core-img" />
        </div>
      </div>
      <div className="core-wrap-wrap">
        <div className="core-img-wrap">
          <img src="/hand.png" alt="손들기" className="core-img" />
        </div>
        <div className="coreWrap">
          <div className="coreSubTitle">
            손들기
          </div>
          <div className="coreTitle">
            선생님의 도움이 필요할 때,
            <br />
            더 이상 채팅을 치지 않아도 돼요.
          </div>
          <div className="coreDescription">
            직접 손을 들어보세요.
            <br />
            도움이 필요할 때 바로 선생님을 부를 수 있어요.
          </div>
        </div>
      </div>
      <div className="core-wrap-wrap">
        <div className="coreWrap">
          <div className="coreSubTitle">
            타이머
          </div>
          <div className="coreTitle">
            째깍째깍...
            <br />
            타이머를 맞춰보세요.
          </div>
          <div className="coreDescription">
            요리 도중 타이머가 필요하신가요?
            <br/>
            손에 음식이 묻어있어도 바로 타이머를 사용할 수 있어요.
          </div>
        </div>
        <div className="core-img-wrap">
          <img src="/timer.png" alt="타이머" className="core-img" />
        </div>
      </div>
      
    </div>
  );
}

export default CoreFunction;
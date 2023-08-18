# CookCreate

<div align="center">

# 편하게 요리🍳하고, 모르면 바로 손드세요!🙋
선생님과 학생의 양방향 소통을 지향하고<br/>
핸즈프리 제스처로 유저들의 편의성을 개선한<br/>
<strong>실시간 피드백 요리 화상 과외 서비스</strong><br/><br/>
![](images/gifs/mainpage.gif)
<br/>
[> UCC 보러가기 <](https://youtu.be/q4hc7BR35PQ)

##  ✨ Member ✨

| [<img src = "https://avatars.githubusercontent.com/u/82308415?v=4" width = 100>](https://github.com/https://github.com/byunyc0124) | [<img src = "https://avatars.githubusercontent.com/u/93422139?v=4" width = 100>](https://github.com/Phabala) | [<img src = "https://avatars.githubusercontent.com/u/90020798?v=4" width = 100>](https://github.com/https://github.com/jjoyra) |
|:---:|:---:|:---:|
|변영채|김기홍|조희라|
|BE, 팀장|AI|BE|

| [<img src = "https://avatars.githubusercontent.com/u/122503936?v=4" width = 100>](https://github.com/https://github.com/suwon205) | [<img src = "https://avatars.githubusercontent.com/u/111420496?v=4" width = 100>](https://github.com/yeeeeeji) | [<img src = "https://avatars.githubusercontent.com/u/97263716?v=4" width = 100>](https://github.com/https://github.com/tsmich926) |
|:---:|:---:|:---:|
|양수원|윤예지|황수아|
|FE|FE|FE|

</div>

## 🍪 서비스 기획 의도 🍪
- 미디어를 통해 요리를 배우게 되면 요리 도중 영상 제어가 어렵고 주로 단방향 소통이 이뤄지는 단점이 발생하는데, 이러한 점을 보완하기 위해 Cook Create 서비스를 기획하였습니다.
- Cookyer(선생님)에게 학생 피드백에 집중할 수 있는 환경을 제공합니다.
- Cookiee(학생)에게 핸즈프리 제스처로 요리에 집중할 수 있는 환경을 제공합니다.

## 🍪 핵심기능 🍪
- 로그인/회원가입 : Spring Security, JWT를 이용하여 인증, 인가, 비밀번호 암호화 구현
- 화상 과외 : OpenVidu 플랫폼을 이용하여 실시간 화상 과외 구현
- 제스쳐 인식 : Mediapipe, 모션 인식 AI를 통해 제스쳐를 인식하여 핸즈프리 기능 구현
- 채팅 : Web Socket, Stomp.js로 화상 과외 전후로 이용 가능한 그룹 채팅 기능 구현

## 🍪 기능별 화면 🍪

#### [> 기능별 화면 GIF 보러가기 <](./exec/CookCreate-UI.md)


## :fork_and_knife: 사용한 외부 서비스
- [Openvidu 플랫폼](https://docs.openvidu.io/en/2.28.0/)
- [카카오페이 API](https://developers.kakao.com/docs/latest/ko/kakaopay/common)

## :fork_and_knife: 시스템 아키텍쳐 
![](images/architecture.png)

## :fork_and_knife: ERD 다이어그램
![](images/erd.png)

## :fork_and_knife: 문서 링크
- [MMT 팀의 노션](https://cottony-brass-90a.notion.site/23bd4357ec2e4df2a96beefb5d1cdd2a?pvs=4)
- [기능명세서](https://cottony-brass-90a.notion.site/09ff28d6d1be43aabeea159add36e0c5?pvs=4)
- [API 명세서](https://cottony-brass-90a.notion.site/API-46e6beb14a7f4c8d8dfb231df9d88db4?pvs=4)
- [화면설계서](https://www.figma.com/file/V1fbyTIiFd3kYydQngyD1S/%ED%99%94%EB%A9%B4%EC%84%A4%EA%B3%84%EC%84%9C?type=design&node-id=16%3A2&mode=design&t=YFBSrXVlptJfM2yB-1)
- [화면설계 - 디자인](https://www.figma.com/file/V1fbyTIiFd3kYydQngyD1S/%ED%99%94%EB%A9%B4%EC%84%A4%EA%B3%84%EC%84%9C?type=design&node-id=582%3A423&mode=design&t=YFBSrXVlptJfM2yB-1)

## 🧈 Git-flow 🧈
- 기능 개발이 완료되면 feature branch를 develop branch로 merge한다.<br/>

- branch 규칙<br/>
> master : 운영 서버로 배포하기 위한 branch<br/>
develop : 다음 출시 기능을 개발하는 branch<br/>
back : backend branch<br/>
front : frontend branch<br/>
feature : 세부 기능을 개발하는 branch, branch 이름은 각 기능명으로 작성<br/>
hotfix : 급한 에러 수정

- feature branch 이름 규칙<br/>

>feature/[front or back]/[기능명]

>ex) feature/back/member<br/>
ex) feature/front/webrtc

## 🧈 commit conventions 🧈
### 형식
- 커밋 타입: 내용 자세히 적어주기 [#지라이슈넘버]<br/>
- ex) FEAT: 로그인 rest api 추가 [#지라이슈넘버]<br/>
- git commit -m "[커밋타입] 커밋메세지 #프로젝트번호-JIRA이슈번호"<br/>

### 타입
> FEAT:    새로운 기능 및 파일을 추가할 경우<br/>
MODIFY:  기능을 변경한 경우<br/>
STYLE:   간단한 수정, 코드 변경이 없는 경우<br/>
FIX:     버그를 고친 경우<br/>
DOCS:    문서를 수정한 경우(ex> Swagger, README)<br/>
COMMENT: 주석 추가/삭제/변경한 경우<br/>
RENAME:  파일 혹은 폴더명 수정 및 이동<br/>
DELETE:  파일 혹은 기능 삭제<br/>
CHORE:    빌드 업무 수정(ex> dependency 추가)<br/>
REFATOR: 프로덕션 코드 리팩토링<br/>
MERGE:   충돌 시 머지, develop 브랜치에 풀리퀘 등

## 🧈 JIRA 규칙 🧈
**EPIC** 
> EPIC내에 해당하는 STORY와 TASK 생성

> 회원 관리, 과외 모집, 리뷰, 화상 과외, 결제, 채팅, 기획 설계, 배포

**STORY**
> 사용자 입장에서 작성

> ex) 사용자는 로그인을 할 수 있다.

**TASK**
> TASK는 STORY에 링크된 이슈로 생성

> BE, FE, 설계, CSS로 나눠서 작성

> ex) [BE] 로그인 API 구현, [FE] 로그인 페이지 구현, [설계] 로그인 ERD 작성, [설계] 로그인 페이지 와이어프레임 설계 등

## 🧈 폴더 구조 🧈
<details>
<summary>backend</summary>

```bash
  ├─ main
  ├─ config
  ├─ controller
  ├─ common
  │  └─ auth
  ├─ domain
  │  ├─ entity
  │  ├─ request # dto
  │  └─ response # dto
  ├─ repository # dao
  │  └─ impl
  └─ service # 서비스
     └─ impl<br/>
```
</details>
<details>
<summary>frontend</summary>

```bash
  ├── docker
  ├── node_modules
  ├── public
  └── src
      ├── assets # image
      ├── components
      ├── pages
      ├── store # redux
      └── style # css
```
</details>

##  ✨ 맡은 역할 ✨

<strong>김기홍</strong>
- 기능명세서 문서화 작업
- 객체탐지 로직 설계를 통한 제스처 탐지 기능 구현
- React-Redux를 활용해 MediaPipe와 OpenVidu 연결
- Docker를 활용한 OpenVidu 서버 배포
- 마이페이지 CSS

<strong>변영채</strong> 
- 기능명세서, API 명세서, 노션 등의 문서화 작업
- Spring Security, JWT, Redis를 활용한 회원가입/로그인 API
- 과외 글/리뷰 CRUD API와 마이페이지 API 개발
- Spring boot에 S3를 연동하여 프로필, 썸네일, 자격증 등의 이미지를 업로드
- Docker를 활용한 EC2 환경에서의 배포
- 과외 등록 및 조회, 모달 CSS
- 최종 발표

<strong>양수원</strong>
- 화면설계서 문서화 작업
- React를 활용하여 회원가입, 로그인, 메인 화면, 검색 기능, 과외 CRUD 구현
- KakaoPay 결제 api를 이용하여 redirect 처리하여 과외 신청 및 환불 구현
- Redux Toolkit을 사용한 스토어 구축
- 과외 수정 및 404 페이지 CSS
- 기획 발표

<strong>윤예지</strong>
- 화면설계서 문서화 작업
- OpenVidu를 이용한 화상과외방 생성 및 종료 기능 구현
- OpenVidu를 이용한 화상과외방 상호작용 기능 구현
- Redux Toolkit 및 Redux Persist 라이브러리를 이용한 스토어 구축
- 화상과외방 및 모달, 레시피북 CSS
- UCC 제작

<strong>조희라</strong>
- 기능명세서, API 명세서, 노션 등의 문서화 작업
- Spring Security를 활용한 회원 조회 및 수정 API 개발
- WebSocket, stompjs, Redis를 이용한 채팅 API 개발
- KakaoPay API를 이용한 결제 API 개발
- Docker, Jenkins를 활용한 EC2 환경에서의 CI/CD
- 서비스 UI 디자인
- 메인페이지 CSS

<strong>황수아</strong>
- 화면설계서 문서화 작업
- React를 활용하여 회원 정보 수정 구현
- stompjs를 활용한 채팅 client 구현
- React를 활용하여 마이페이지의 과외 목록, 레시피북, 결제내역 목록 구현
- React, 모달을 이용한 리뷰 CRUD 구현
- 채팅 CSS

# 리엑트와 Node.js 기반의 익스프레스(Typescript)로 만든 웹소캣 채팅 프로그램 입니다.
1. 데이터베이스는 따로 사용하지 않고 맵(Map) 객체에 로그인 및 채팅방을 기록 합니다.
2. 주고받는 채팅 메시지는 보관하지 않습니다. ^^;
3. 기능이 간단하게 틀만 구성되어 있습니다(스타일은 부트스트랩을 간단하게 사용하였습니다)

#### 익스프레스 서버 모습
![](https://user-images.githubusercontent.com/17187262/170872126-09a38d1f-d2d1-4df9-be32-18f079a60d86.JPG)

#### 화면인 리엑트 사용 모습
![afffffff](https://user-images.githubusercontent.com/17187262/170872421-7a2c2238-c6d2-4336-9df3-19ab6e986cdc.JPG)

***
- Server 디렉토리
  - 타입스크립트(Typescript) 로 개발하였습니다.
  - index.ts : express를 활용하여 일반 페이지를 보여주고, 채팅방 만들기 및 목록 기능을 제공 하는 메인기능이 존재 합니다.
  - chattings.ts : 웹소켓 서버와 관련된 행동을 정의하는 파일 입니다.
  - Anno.ts : 에노테이션을 보관하기 위한 파일 입니다.
  - **실행방법 : server/ npm run start**

- Apps 디렉토리
  - 리엑트+함수형으로 개발하였습니다.(2022년도 5월 최신 버전)
  - index.js : 코어 페이지 입니다. 레덕스를 제공(store) 합니다.  
  - App.js : 라우터 역할을 담당 합니다(해쉬라우터)  
  - state 디렉토리 : 리듀서들을 보관 합니다.
  - component 디렉토리 : 화면을 구성하는 파일(컴포넌트)들을 보관 합니다.
    - Main.js : 로그인과 회원가입 페이지 입니다(둘다 간단하게 구현되어 있습니다.)
    - ChattingList.js : 채팅방 목록을 가져오고 채팅방을 만드는 페이지 입니다.
    - Chatting.js : 채팅을 하는 기능이 있습니다.
    - NotFound.js : 없는 페이지로의 요청을 담당 합니다.
  - **실행방법 : apps/ npm run start**   

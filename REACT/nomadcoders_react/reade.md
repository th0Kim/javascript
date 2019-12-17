[ WEBPACK 설치 ]
1. 해당 폴더에서
    npm init
    다음에 나오는 정보를 하나씩 입력(전체가 필요x)

2. 리액트 돔 설치
    npm i react react-dom

3. 리액트에 필요한 webpack을 설치 (-D : 개발 할때만 webpack을 쓴다는 의미)
    npm i -D webpack webpack-cli

4.  파일 생성
    webpack_config.js
        :
        module.exports = {};
    client.jsx
        : 리액트와 리액트 돔을 사용할 수 있게 함
        const React = require('react');
        const ReactDom = require('react-dom');

5. 더이상 아래 CDN이 필요 없음 
    <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>

6. 이상 기본 세팅 방법

7. 작업 파일
    client.jsx
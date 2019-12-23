1. node가 설치 되어 있어야한다.
2. 해당 폴더에 cdm으로 init 입력 : package.json 생성
    npm init
    다음 오는 사항들 작성
    Is this OK? yes
3. 리액트와 리액트 돔 설치
    npm i react react-dom

4.  웹팩 사용 설치 (-D는 개발용이라는 뜻) : 주의사항> 프로젝트 이름 = package.json 의 name이 동일하면 정상적으로 설치 되지 않는다.
    npm i -D webpack webpack-cli

이상 creat-react-app에서 자동으로 해주는 것

//////////after/////////
1. webpack.config.js 생성
    module.exports = {};
2. client.jsx 생성 : node에서 리액트/리액트돔 불러오기 : .jsx로 적어주는 이유는 파일만 봐도 리액트 사용을 알수있어 효율적임
    const React = require('react');
    const ReactDom = require('react-dom');
3. html 기본 설정
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>끝말잇기</title>
    </head>
    <body>
        <div id="root"></div>
        <script src="./dist/app.js"></script> <!-- 소스 불러오기 -->
    </body>
    </html>
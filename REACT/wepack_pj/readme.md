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


/////////////////ETC
1. 웹팩은 html에 js 한 파일만 불러올 수 있도록 jsx를 한 파일로 합쳐주는 역할을 한다.
const path = require('path'); //노드 사용법중 하나 > 외우기 : 경로를 쉽게 조작
// 웹팩 설정 파일
module.exports = {
    name: 'wordrelay-setting', // 필수는 아니나 파일에 대한 설명으로 식별성 높임
    mode: 'dvelopment', //실서비스 : production
    devtool: 'eval', //빠르게
    resolve: {
        extensions: ['.js','.jsx'] // entry에 확장자를 적지 않아도 이렇게 적어주면 알아서 찾아감
    },
    
    // 이하 중요
    entry: { //입력
        app: ['./client'], // 배열로 적어준 jsx 파일을 합쳐서 아래 OUTPUT으로 합침 : 이미 client.jsx에 wordrelay.jsx가 불러옴 이 경우 외 이어서 배열과 같이 적어준다.
    },
    modules: {
        rules: [{
            test: /\.jsx?/,
            loader: 'babel-loader',
            option: {
                presets: ['@babel/preset-env','@babel/preset-react'],
            }
        }]
    }, //연결
    output: { //출력
        path: path.join(__dirname, 'dist'), //path로 실경로를 다 쓰지 않아도 편하게 설정 : __dirname = "현재 폴더"의 의미 (현재 폴더의 'dist' 경로)
        filename: 'app.js'
    },
};


/// babel 설치 : jsx를 사용하게끔 하는 것
1.  core 설치 (기본)
    npm i -D @babel/core

2.  브라우저에 맞게 최신문법을 과거 문법으로 변경
    npm i -D @babel/preset-env

3.  jsx 지원
    npm i -D @babel/preset-react

4.  바벨과 웹팩을 연결
    npm i babel-loader

5.  
    npm i -D @babel/plugin-proposal-class-properties
const path = require('path'); //노드 사용법중 하나 > 외우기 : 경로를 쉽게 조작

module.exports = {
    name: 'wordrelay-setting',
    mode: 'dvelopment', //실서비스 : production
    devtool: 'eval', //빠르게
    resolve: {
        extensions: ['.js','.jsx'] // entry에 확장자를 적지 않아도 이렇게 적어주면 알아서 찾아감
    },
    
    // 중요
    entry: { //입력
        app: ['./client'], // 배열로 적어준 jsx 파일을 합쳐서 아래 OUTPUT으로 합침
    },
    output: { //출력
        path: path.join(__dirname, 'dist'), //path로 실경로를 다 쓰지 않아도 편하게 설정
        filename: 'app.js'
    },
};
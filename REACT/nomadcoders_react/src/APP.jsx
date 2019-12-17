const React = require('react');
const ReactDom = require('react-dom');
// 이상 기본 세팅

import React, { Component } from 'react';
import './Movie.css';
import Movie from './Movie'; // 아래 <Movie />와 매칭

class APP extends Component {
    render() {
        return (
            <div className="App">
                <Movie />
            </div>
        )
    }
}
export default APP;
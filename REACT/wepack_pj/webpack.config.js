const path = require('path'); 

module.exports = {
    name: 'wordrelay-setting',
    mode: 'dvelopment',
    devtool: 'eval',
    resolve: {
        extensions: ['.js','.jsx']
    },
    
    entry: {
        app: ['./client'],
    },
    modules: {
        rules: [{
            test: /\.jsx?/,
            loader: 'babel-loader',
            option: {
                presets: ['@babel/preset-env','@babel/preset-react'],
                plugins: ['@babel/plugin-proposal-class-properties'],
            }
        }]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'app.js'
    },
};
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: path.join(__dirname, 'src/app/index.jsx'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'tracky.min.js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
//            {
//                test: /\.js$/,
//                loaders: ['json']
//            }, 
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel'
            },
//            {
//                test: /\.jsx$/,
//                loader: 'jsx-loader'
//            }
        ]
    },
    devServer: {
      port: 3000,
      historyApiFallback: true
    },
}